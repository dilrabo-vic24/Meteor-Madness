import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// --- YECHIM: Masshtablashtirishni soddalashtiramiz ---
// Har bir Astronomik Birlikni (AU) sahnadagi 10,000 birlikka tenglashtiramiz.
const AU_SCALE_FACTOR = 10000; 
// Asteroid modelining o'lchamini ham shu masshtabga moslaymiz.
const ASTEROID_VISUAL_SCALE = 500; 

const AsteroidViewer = ({ trajectoryData }) => {
    const { scene } = useLoader(GLTFLoader, '/models/asteroid.glb');
    const asteroidRef = useRef();

    const points = useMemo(() => {
        const result = [];
        // API'dan kelgan har bir nuqtani to'g'ri masshtablaymiz
        for (let i = 0; i < trajectoryData.positions.length; i += 3) {
            result.push(new THREE.Vector3(
                trajectoryData.positions[i] * AU_SCALE_FACTOR,
                trajectoryData.positions[i + 2] * AU_SCALE_FACTOR, // Y va Z o'rinlari almashgan
                trajectoryData.positions[i + 1] * AU_SCALE_FACTOR
            ));
        }
        return result;
    }, [trajectoryData.positions]);

    useFrame((state) => {
        if (!asteroidRef.current || points.length === 0) return;

        const t = state.clock.getElapsedTime();
        const speed = 4;
        const index = Math.floor((t * speed) % points.length);
        
        asteroidRef.current.position.copy(points[index]);
    });

    return (
        <group>
            <primitive ref={asteroidRef} object={scene} scale={ASTEROID_VISUAL_SCALE}>
                <Html position={[0, ASTEROID_VISUAL_SCALE * 1.5, 0]} center> 
                    <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md select-none whitespace-nowrap">
                        {trajectoryData.name}
                    </div>
                </Html>
            </primitive>
            
            {/* Chiziq qalinligini oshiramiz */}
            <Line points={points} color="#ff6347" lineWidth={2} transparent opacity={0.9} />
        </group>
    );
};

export default AsteroidViewer;