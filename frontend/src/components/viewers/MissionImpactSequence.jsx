import React, { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSpring, a } from '@react-spring/three';

function Earth() {
    const earthRef = useRef();
    const [map, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
        '/textures/2k_earth_daymap.jpg',
        '/textures/2k_earth_normal_map.jpg',
        '/textures/2k_earth_specular_map.jpg',
    ]);
    useFrame(() => { earthRef.current.rotation.y += 0.001; });
    return <mesh ref={earthRef}><sphereGeometry args={[5, 64, 64]} /><meshStandardMaterial map={map} normalMap={normalMap} metalnessMap={specularMap} metalness={0.4} roughness={0.7} /></mesh>;
}

function ImpactSphere() {
    const { scale, opacity } = useSpring({
        from: { scale: 0, opacity: 1 },
        to: { scale: 2.5, opacity: 0 },
        config: { duration: 1500, tension: 100 },
    });
    return <a.mesh position={[5.05, 0, 0]} scale={scale}><sphereGeometry args={[1, 32, 32]} /><a.meshStandardMaterial color="yellow" emissive="orange" transparent opacity={opacity} /></a.mesh>;
}

function ImpactingAsteroid() {
    const { scene } = useLoader(GLTFLoader, '/models/asteroid.glb');
    const [hasImpacted, setHasImpacted] = useState(false);

    const { position } = useSpring({
        from: { position: [30, 20, -30] },
        to: { position: [5.1, 0, 0] }, // Point on Earth's surface
        config: { duration: 6000, tension: 100 },
        onRest: () => setHasImpacted(true), // Trigger impact effect on animation end
    });

    return (
        <>
            {!hasImpacted && (
                <a.mesh position={position}>
                    <primitive object={scene} scale={0.5} /> 
                    <Html distanceFactor={15}>
                        <div className="text-red-400 text-xs font-bold bg-black/50 p-1 rounded-sm">Impactor-2025</div>
                    </Html>
                </a.mesh>
            )}
            {hasImpacted && <ImpactSphere />}
        </>
    );
}

const MissionImpactSequence = () => {
    return (
        <Canvas camera={{ position: [15, 7, 25], fov: 50 }}>
            <Suspense fallback={<Html center><div className="text-white">Loading Impact Scenario...</div></Html>}>
                <ambientLight intensity={0.3} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                
                <Earth />
                <ImpactingAsteroid />

                <Stars radius={150} depth={50} count={5000} factor={5} />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.1} />
            </Suspense>
        </Canvas>
    );
};

export default MissionImpactSequence;