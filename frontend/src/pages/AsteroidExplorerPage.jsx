import React, { useRef, Suspense } from 'react'; // React importlari
import { Canvas, useFrame } from '@react-three/fiber'; // Three.js uchun
import { Html, Stars, OrbitControls, Loader, Bounds } from '@react-three/drei'; // Yordamchi komponentlar

import { useAppContext } from '../context/AppContext'; // O'zimizning context
import AsteroidList from '../components/AsteroidList'; // Komponentlar
import AsteroidViewer from '../components/viewers/AsteroidViewer';

// Harakatlanuvchi yulduzlar komponenti
const MovingStars = () => {
  const starsRef = useRef(null); // useRef'ga boshlang'ich qiymat beramiz

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.position.copy(state.camera.position);
    }
  });

  // Yulduzlar radiusini va sonini kamaytiramiz, bu Bounds bilan yaxshiroq ishlaydi
  return (
    <group ref={starsRef}>
      <Stars radius={5000} depth={50} count={5000} factor={10} saturation={1} fade speed={0.5} />
    </group>
  );
};

// Holat (status) xabarlarini ko'rsatuvchi komponent
const StatusDisplay = ({ message, isError = false }) => {
  return (
    <Html center>
      <div className={`text-center px-6 py-3 bg-black/60 rounded-lg backdrop-blur-md shadow-lg ${isError ? 'text-red-400' : 'text-gray-300'}`}>
        <p>{message}</p>
      </div>
    </Html>
  );
};

// Sahnani boshqaruvchi komponent
const SceneController = () => {
    const { trajectory, isFetchingTrajectory, error, selectedAsteroid } = useAppContext();

    if (isFetchingTrajectory) {
      return null; // Yuklanayotganda hech narsa ko'rsatmaymiz
    }
    
    if (error) {
      return <StatusDisplay message={error} isError={true} />;
    }
    
    if (trajectory && trajectory.positions && trajectory.positions.length > 0) {
        return (
            <Bounds key={selectedAsteroid.spk_id} fit clip observe margin={1.5}>
                <AsteroidViewer trajectoryData={trajectory} />
            </Bounds>
        );
    }
    
    // Boshlang'ich holat
    return <StatusDisplay message="Select an asteroid from the list to begin." />;
};

// Asosiy sahifa komponenti
const AsteroidExplorerPage = () => {
  const {
    neoList,
    isLoading: isListLoading,
    selectedAsteroid,
    selectAsteroid
  } = useAppContext();

  const handleSelection = (neo) => {
    selectAsteroid(neo.neo_reference_id, neo.name.replace(/[()]/g, ''));
  };
  
  // -- JSX QISMI --
  // `Expression expected` xatosi odatda shu qismda bo'ladi
  return (
    <div className="w-full h-full flex bg-black">
      {/* Chap panel */}
      <div className="w-80 h-full flex-shrink-0 border-r border-gray-700/50 overflow-y-auto z-10 bg-black/40 backdrop-blur-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 text-cyan-300 tracking-wide">Asteroid Explorer</h2>
          <p className="text-sm text-gray-400 mb-6">
            Select a real near-Earth object to visualize its trajectory.
          </p>
          <AsteroidList
            neoList={neoList}
            isLoading={isListLoading}
            selectedSpkId={selectedAsteroid?.spk_id}
            onSelect={handleSelection}
          />
        </div>
      </div>
      
      {/* O'ng panel (3D ko'rish maydoni) */}
      <div className="flex-1 h-full relative">
        <Canvas camera={{ fov: 75 }}>
            <ambientLight intensity={0.8} />
            <pointLight color="white" position={[0, 0, 0]} intensity={1.5} />
            
            <Suspense fallback={null}>
                <SceneController />
                <MovingStars />
            </Suspense>

            <OrbitControls makeDefault />
        </Canvas>
        <Loader />
      </div>
    </div>
  );
};

export default AsteroidExplorerPage;