import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AsteroidList from '../components/AsteroidList';
import GlobalView from '../components/viewers/GlobalView';
import PlanetList from '../components/PlanetList'; // Yangi komponentni import qilamiz

// Ko'rinish rejimini o'zgartirish uchun boshqaruv paneli
const ViewControls = ({ viewMode, setViewMode }) => (
  <div className="mt-6 p-3 bg-gray-800/50 rounded-md">
    <label className="block text-sm font-medium text-gray-300 mb-2">Ko'rinish Masshtabi</label>
    <div className="flex bg-gray-900/70 rounded-md p-1">
      <button onClick={() => setViewMode('visual')} className={`w-1/2 py-1 text-xs rounded transition-colors ${viewMode === 'visual' ? 'bg-cyan-600' : 'hover:bg-white/10'}`}>
        Vizual
      </button>
      <button onClick={() => setViewMode('realistic')} className={`w-1/2 py-1 text-xs rounded transition-colors ${viewMode === 'realistic' ? 'bg-cyan-600' : 'hover:bg-white/10'}`}>
        Realistik
      </button>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      {viewMode === 'visual' 
        ? "Sayyoralar hajmi va masofasi yaxshiroq ko'rish uchun kattalashtirilgan." 
        : "Orbitalar ilmiy aniqlikka yaqinroq, masshtab o'zgartirilgan."}
    </p>
  </div>
);

const ExplorerPage = () => {
  // Markaziy state'dan kerakli ma'lumotlarni olamiz
  const { 
    neoList, isLoading, error, selectedAsteroid, 
    trajectory, isFetchingTrajectory, selectAsteroid 
  } = useAppContext();
  
  // Ushbu sahifaga xos bo'lgan state'lar
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'realistic'
  const [cameraTargetName, setCameraTargetName] = useState(null); // Kamera qaysi ob'ektga qarashini belgilaydi

  // Sayyoralar ro'yxati (static)
  const solarSystemPlanets = [
      { name: 'Mercury' }, { name: 'Venus' }, { name: 'Earth' }, { name: 'Mars' },
      { name: 'Jupiter' }, { name: 'Saturn' }, { name: 'Uranus' }, { name: 'Neptune' }
  ];

  // Sayyora tanlanganda ishlaydigan funksiya
  const handleSelectPlanet = (name) => {
      selectAsteroid(null); // Agar asteroid tanlangan bo'lsa, uni bekor qilamiz
      setCameraTargetName(name); // Yangi nishonni (sayyorani) belgilaymiz
  };
  
  // Asteroid tanlanganda ishlaydigan funksiya
  const handleSelectAsteroid = (spkId, name) => {
      setCameraTargetName(null); // Agar sayyora nishonda bo'lsa, bekor qilamiz
      selectAsteroid(spkId, name); // Yangi asteroidni tanlaymiz (bu uning traektoriyasini yuklaydi)
  }

  return (
    <div className="w-full h-full flex">
      {/* Chap Tomon: Boshqaruv Paneli */}
      <div className="w-1/4 h-full border-r border-gray-700/50 overflow-y-auto z-10 bg-black/30 backdrop-blur-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-cyan-300">Kashfiyot Rejimi</h2>
          
          <ViewControls viewMode={viewMode} setViewMode={setViewMode} />
          
          <PlanetList planets={solarSystemPlanets} onSelect={handleSelectPlanet} />

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          
          <AsteroidList 
            neoList={neoList}
            isLoading={isLoading || isFetchingTrajectory}
            selectedSpkId={selectedAsteroid?.spk_id}
            onSelect={handleSelectAsteroid}
          />
        </div>
      </div>

      {/* O'ng Tomon: 3D Vizualizatsiya */}
      <div className="w-3/4 h-full relative">
        <GlobalView 
            trajectory={trajectory} 
            viewMode={viewMode} 
            cameraTargetName={cameraTargetName}
            setCameraTargetName={setCameraTargetName} // Kamerani reset qilish uchun
        />
      </div>
    </div>
  );
};

export default ExplorerPage;