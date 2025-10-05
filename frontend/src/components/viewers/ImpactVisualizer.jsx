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

  useFrame(() => {
    earthRef.current.rotation.y += 0.0005;
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial map={map} normalMap={normalMap} metalnessMap={specularMap} metalness={0.4} roughness={0.7} />
    </mesh>
  );
}

function ImpactingAsteroid({ impactData }) {
  const { scene } = useLoader(GLTFLoader, '/models/asteroid.glb');
  const [hasImpacted, setHasImpacted] = useState(false);

  // Safety check for asteroid diameter
  const diameter = impactData?.input_params?.diameter_m || 500;
  const asteroidScale = diameter / 8000;

  const { position } = useSpring({
    from: { position: [15, 15, 15] },
    to: { position: [5.1, 0, 0] },
    config: { duration: 4000 },
    onRest: () => setHasImpacted(true),
  });

  return (
    <>
      <a.mesh position={position}>
         <primitive object={scene} scale={asteroidScale} />
      </a.mesh>
      {hasImpacted && <ImpactSphere craterSize={impactData.impact_effects.crater_diameter_km} />}
    </>
  );
}

function ImpactSphere({ craterSize }) {
    const scale = Math.max(0.1, craterSize / 500);
    const { sphereScale, opacity } = useSpring({
        from: { sphereScale: 0, opacity: 0.8 },
        to: { sphereScale: scale, opacity: 0 },
        config: { duration: 2000 }
    });
    return (
        <a.mesh position={[5.05, 0, 0]} scale={sphereScale}>
            <sphereGeometry args={[1, 32, 32]} />
            <a.meshStandardMaterial color="yellow" emissive="orange" transparent opacity={opacity} />
        </a.mesh>
    );
}

const ImpactVisualizer = ({ impactData }) => {
  if (!impactData) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
            <p className="text-gray-400">Awaiting impact data...</p>
        </div>
      );
  }

  return (
    <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
      <Suspense fallback={<Html center><div className="text-white">Loading Scene...</div></Html>}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Earth />
        <ImpactingAsteroid impactData={impactData} />

        <Stars radius={100} depth={50} count={5000} factor={4} />
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.3} />
      </Suspense>
    </Canvas>
  );
};

export default ImpactVisualizer;