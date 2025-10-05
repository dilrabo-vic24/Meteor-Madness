import React, { useState } from 'react';
import GlobalView from '../components/viewers/GlobalView';

const ViewControls = ({ viewMode, setViewMode }) => (
    <div className="p-3 bg-gray-800/50 rounded-md">
        <label className="block text-sm font-medium text-gray-300 mb-2">View Scale</label>
        <div className="flex bg-gray-900/70 rounded-md p-1">
            <button onClick={() => setViewMode('visual')} className={`w-1/2 py-1 text-xs rounded transition-colors ${viewMode === 'visual' ? 'bg-cyan-600' : 'hover:bg-white/10'}`}>
                Visual
            </button>
            <button onClick={() => setViewMode('realistic')} className={`w-1/2 py-1 text-xs rounded transition-colors ${viewMode === 'realistic' ? 'bg-cyan-600' : 'hover:bg-white/10'}`}>
                Realistic
            </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
            {viewMode === 'visual'
                ? "Planet sizes are exaggerated for better visibility."
                : "Orbits are closer to scientific accuracy, scale is adjusted."}
        </p>
    </div>
);

const SolarSystemPage = () => {
    // ---- XATO TUZATILDI ----
    const [viewMode, setViewMode] = useState('visual');

    return (
        <div className="w-full h-full flex">
            <div className="w-1/4 h-full border-r border-gray-700/50 overflow-y-auto z-10 bg-black/30 backdrop-blur-sm">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4 text-cyan-300">Solar System View</h2>
                    <ViewControls viewMode={viewMode} setViewMode={setViewMode} />
                     <p className="text-xs text-gray-400 mt-4">
                        Explore the solar system. Use your mouse to navigate, pan, and zoom to observe the planets and their orbits.
                    </p>
                </div>
            </div>
            <div className="w-3/4 h-full relative">
                <GlobalView
                    viewMode={viewMode}
                    trajectory={null}
                />
            </div>
        </div>
    );
};

export default SolarSystemPage;