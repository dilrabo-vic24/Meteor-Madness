import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Navbar from './components/layout/Navbar';
import SolarSystemPage from './pages/SolarSystemPage';
import AsteroidExplorerPage from './pages/AsteroidExplorerPage';
import MissionPage from './pages/MissionPage';
import ImpactSimulationPage from './pages/ImpactSimulationPage';

function App() {
  return (
    <AppProvider> 
      <Router>
        <div className="w-screen h-screen bg-gray-900 text-white font-sans">
          <Navbar />
          <main className="pt-16 h-full">
            <Routes>
              <Route path="/" element={<SolarSystemPage />} />
              <Route path="/asteroids" element={<AsteroidExplorerPage />} />
              <Route path="/mission" element={<MissionPage />} />
              
              {/* Corrected route path */}
              <Route path="/impact/:spkId" element={<ImpactSimulationPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;