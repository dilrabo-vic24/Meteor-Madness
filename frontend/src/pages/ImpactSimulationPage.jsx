import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchPopulationImpact } from '../api/api';
import ImpactDetailsPanel from '../components/impact/ImpactDetailsPanel';
import ImpactVisualizer from '../components/viewers/ImpactVisualizer';

const ImpactSimulationPage = () => {
  const location = useLocation();
  const impactData = location.state?.impactData;
  const [populationInfo, setPopulationInfo] = useState({ loading: true, data: null });

  useEffect(() => {
    if (impactData) {
      const { latitude, longitude } = impactData.impact_location;
      const crater_km = impactData.impact_effects.crater_diameter_km;
      
      const getPopulationData = async () => {
        try {
          const popData = await fetchPopulationImpact(latitude, longitude, crater_km);
          setPopulationInfo({ loading: false, data: popData });
        } catch (error) {
          console.error("Population API error:", error);
          setPopulationInfo({ loading: false, data: { error: "Could not load population data." } });
        }
      };
      getPopulationData();
    }
  }, [impactData]);

  if (!impactData) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl text-red-400">Simulation Data Not Found</h2>
            <p className="text-gray-400 mt-2">No impact data was provided for this simulation.</p>
            <Link to="/mission" className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md">
                Return to Mission Control
            </Link>
        </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-gray-900">
      {/* Details Panel */}
      <div className="w-full md:w-1/3 h-full border-r border-red-500/30 overflow-y-auto bg-black/30 backdrop-blur-sm">
        <ImpactDetailsPanel 
            data={impactData} 
            populationInfo={populationInfo}
        />
      </div>
      {/* 3D Visualization */}
      <div className="w-full md:w-2/3 h-full relative">
        <ImpactVisualizer impactData={impactData} />
      </div>
    </div>
  );
};

export default ImpactSimulationPage;