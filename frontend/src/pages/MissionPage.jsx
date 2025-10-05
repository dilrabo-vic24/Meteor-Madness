import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMissionTarget, fetchImpactEffects } from '../api/api';
import MissionImpactSequence from '../components/viewers/MissionImpactSequence';

const MissionPage = () => {
    const navigate = useNavigate();
    const [missionTarget, setMissionTarget] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMissionData = async () => {
            try {
                const targetData = await getMissionTarget();
                if (targetData && targetData.length > 0) {
                    setMissionTarget(targetData[0]);
                } else {
                    throw new Error("Mission target data not found.");
                }
            } catch (err) { 
                setError("Failed to load mission data. Please try again later."); 
            } finally { 
                setIsLoading(false); 
            }
        };
        loadMissionData();
    }, []);

    const handleSimulateImpact = async () => {
        if (!missionTarget) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const spkId = missionTarget.neo_reference_id;
            const impactData = await fetchImpactEffects(spkId);
            navigate(`/impact/${spkId}`, { state: { impactData } });
        } catch (err) {
            setError("An error occurred during simulation. The API might be unavailable.");
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full h-full flex bg-gray-900">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 h-full border-r border-red-500/50 overflow-y-auto z-10 bg-black/30 backdrop-blur-md">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-2 text-red-400 tracking-wide">Mission: "Impactor-2025"</h2>
                    <p className="text-sm text-gray-300">
                        You are the lead analyst of the Planetary Defense Coordination Office.
                    </p>

                    <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-800/20">
                        <h3 className="text-lg font-semibold text-white">Step 1: Visualization</h3>
                        <p className="mt-1 text-sm text-gray-400">
                           The object "Impactor-2025" is on a collision course. The visualization shows the final approach and impact sequence.
                        </p>
                    </div>
                    
                    <div className="mt-6 p-4 border rounded-lg border-yellow-500/50 bg-yellow-900/20">
                        <h3 className="text-lg font-semibold text-white">Step 2: Get Full Report</h3>
                        <p className="mt-1 text-sm text-gray-400">
                           Click to calculate the detailed impact consequences: crater size, seismic activity, and potential threat to populations.
                        </p>
                         <button 
                            onClick={handleSimulateImpact}
                            disabled={isLoading || !missionTarget}
                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : 'Get Impact Report'}
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-center mt-4 p-2 bg-red-900/50 rounded-md">{error}</p>}
                </div>
            </div>

            {/* 3D Viewer */}
            <div className="w-full md:w-3/4 h-full relative">
                <MissionImpactSequence />
            </div>
        </div>
    );
};

export default MissionPage;