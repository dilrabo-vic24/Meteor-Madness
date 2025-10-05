import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Constants
const SCENE_UNIT = 1_000_000;
const SCALES = {
  visual: { PLANET_SIZE_MULTIPLIER: 750, ASTEROID_SIZE_MULTIPLIER: 1500 },
  realistic: { PLANET_SIZE_MULTIPLIER: 50, ASTEROID_SIZE_MULTIPLIER: 100 }
};
const solarSystemData = [
    { name: 'Sun', texture: '/textures/2k_sun.jpg', radius: 696340, distance: 0, period: 0, isStar: true },
    { name: 'Mercury', texture: '/textures/2k_mercury.jpg', radius: 2439, distance: 57.9 * SCENE_UNIT, period: 0.24 },
    { name: 'Venus', texture: '/textures/2k_venus_surface.jpg', radius: 6051, distance: 108.2 * SCENE_UNIT, period: 0.62 },
    { name: 'Earth', texture: '/textures/2k_earth_daymap.jpg', radius: 6371, distance: 149.6 * SCENE_UNIT, period: 1 },
    { name: 'Mars', texture: '/textures/2k_mars.jpg', radius: 3389, distance: 227.9 * SCENE_UNIT, period: 1.88 },
    { name: 'Jupiter', texture: '/textures/2k_jupiter.jpg', radius: 69911, distance: 778.6 * SCENE_UNIT, period: 11.86 },
    { name: 'Saturn', texture: '/textures/2k_saturn.jpg', radius: 58232, distance: 1433.5 * SCENE_UNIT, period: 29.45, hasRing: true },
    { name: 'Uranus', texture: '/textures/2k_uranus.jpg', radius: 25362, distance: 2872.5 * SCENE_UNIT, period: 84.01 },
    { name: 'Neptune', texture: '/textures/2k_neptune.jpg', radius: 24622, distance: 4495.1 * SCENE_UNIT, period: 164.8 },
];

function OrbitalLine({ radius }) {
    const points = useMemo(() => {
        const p = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            p.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        return p;
    }, [radius]);
    return <Line points={points} color="white" lineWidth={0.15} transparent opacity={0.3} />;
}

function SaturnRing({ scaleFactor }) {
    const ringTexture = useLoader(THREE.TextureLoader, '/textures/2k_saturn_ring_alpha.png');
    const ringInnerRadius = 92000 / SCENE_UNIT * scaleFactor;
    const ringOuterRadius = 140000 / SCENE_UNIT * scaleFactor;
    return <mesh rotation-x={Math.PI / 2}><ringGeometry args={[ringInnerRadius*1.2, ringOuterRadius*1.2, 64]} /><meshBasicMaterial map={ringTexture} side={THREE.DoubleSide} transparent={true} opacity={0.9} /></mesh>;
}

const Planet = ({ data, viewMode }) => {
    const planetRef = useRef();
    const map = useLoader(THREE.TextureLoader, data.texture);
    const scaleConfig = SCALES[viewMode];
    const visualRadius = (data.radius / SCENE_UNIT) * (data.isStar ? 200 : scaleConfig.PLANET_SIZE_MULTIPLIER);
    const orbitalRadius = data.distance / SCENE_UNIT;

    useFrame(({ clock }) => {
        if (!planetRef.current) return;
        planetRef.current.rotation.y += 0.005; // Self-rotation
        if (data.period > 0) {
            // Slowed down orbital speed for better visualization
            const angle = (clock.getElapsedTime() * 0.05 / data.period);
            planetRef.current.position.set(Math.cos(angle) * orbitalRadius, 0, Math.sin(angle) * orbitalRadius);
        }
    });

    return (
        <group>
            <group ref={planetRef}>
                <mesh name={data.name}>
                    <sphereGeometry args={[visualRadius, 64, 64]} />
                    {data.isStar ? <meshBasicMaterial map={map} color="#FFD700" /> : <meshStandardMaterial map={map} />}
                    <Html distanceFactor={200} position={[0, visualRadius*1.5, 0]}>
                        <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md select-none whitespace-nowrap">{data.name}</div>
                    </Html>
                </mesh>
                {data.hasRing && <SaturnRing scaleFactor={scaleConfig.PLANET_SIZE_MULTIPLIER} />}
            </group>
            {!data.isStar && <OrbitalLine radius={orbitalRadius} />}
        </group>
    );
};

const Asteroid = ({ positions, name, viewMode }) => {
    if (!positions || positions.length === 0) return null;

    const { scene } = useLoader(GLTFLoader, '/models/asteroid.glb');
    const asteroidRef = useRef();
    const scaleConfig = SCALES[viewMode];
    
    const points = useMemo(() => {
        const AU_TO_KM = 149.6 * SCENE_UNIT;
        const result = [];
        for (let i = 0; i < positions.length; i += 3) {
            result.push(new THREE.Vector3((positions[i]*AU_TO_KM)/SCENE_UNIT, (positions[i+2]*AU_TO_KM)/SCENE_UNIT, (positions[i+1]*AU_TO_KM)/SCENE_UNIT));
        }
        return result;
    }, [positions]);

    useFrame((state) => {
        if (points.length > 0 && asteroidRef.current) {
            const t = state.clock.getElapsedTime();
            const speed = 10;
            const index = Math.floor((t * speed) % points.length);
            asteroidRef.current.position.copy(points[index]);
        }
    });

    return (
        <>
            <primitive ref={asteroidRef} object={scene} scale={scaleConfig.ASTEROID_SIZE_MULTIPLIER} />
            <Line points={points} color="#ff6347" lineWidth={2} />
            <Html position={asteroidRef.current?.position}>
                <div className="text-red-400 text-xs font-bold bg-black/50 px-1 rounded-sm select-none">{name}</div>
            </Html>
        </>
    );
};

const GlobalView = ({ trajectory, viewMode = 'visual' }) => {
    return (
        <div className="w-full h-full bg-black">
            <Canvas camera={{ position: [0, 2500, 4500], fov: 50, near: 0.1, far: 20000 }}>
                <Suspense fallback={<Html center><div className="text-white">Loading Universe...</div></Html>}>
                    
                    <ambientLight intensity={0.3} />
                    <pointLight name="Sun" color="#fdfbd3" position={[0, 0, 0]} intensity={1.5} decay={2} />

                    {solarSystemData.map(planet => <Planet key={planet.name} data={planet} viewMode={viewMode} />)}
                    
                    {trajectory?.positions && <Asteroid positions={trajectory.positions} name={trajectory.name} viewMode={viewMode} />}
                    
                    <Stars radius={8000} depth={100} count={10000} factor={15} saturation={0} fade speed={0.5} />
                    <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default GlobalView;