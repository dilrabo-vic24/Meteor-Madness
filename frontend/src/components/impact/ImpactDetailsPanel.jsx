import React from 'react';

const DetailItem = ({ label, value, unit, colorClass = 'text-white' }) => (
  <div className="flex justify-between items-baseline py-3 border-b border-gray-700/50">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`font-bold text-lg ${colorClass}`}>
      {value} <span className="text-xs text-gray-500">{unit}</span>
    </span>
  </div>
);

const PopulationImpactCard = ({ info }) => {
    if (info.loading) return <div className="text-center p-4">Loading Population Data...</div>;
    if (info.data?.error) return <div className="text-center text-red-400 p-4">{info.data.error}</div>;
    
    return (
        <div className="mt-6 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 text-center">
            <h4 className="font-bold text-yellow-300">Estimated Population Impact</h4>
            <p className="text-4xl font-bold mt-2 text-white">
                {info.data.affected_population.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">people within the affected zone</p>
        </div>
    );
};

const SocialShare = ({ data }) => {
    const text = `I just simulated an impact by asteroid "${data.name}" using A.R.I.E.S. The result: ${data.impact_effects.energy_megatons} MT of explosive force! #ARIES #AsteroidSimulation`;
    const encodedText = encodeURIComponent(text);

    return (
        <div className="mt-6 text-center space-x-2">
            <button 
                onClick={() => navigator.clipboard.writeText(text)} 
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
            >
                Copy Results
            </button>
            <a 
                href={`https://twitter.com/intent/tweet?text=${encodedText}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors"
            >
                Share on X
            </a>
        </div>
    );
};

const ImpactDetailsPanel = ({ data, populationInfo }) => {
  const { input_params, impact_effects, analogy, name } = data;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold text-red-400 border-b-2 border-red-500/50 pb-2 mb-4">
        Impact Simulation Results
      </h2>
      <p className="text-lg font-semibold text-gray-300 mb-6">{name.replace(/[()]/g, '')}</p>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-300">Input Parameters</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <DetailItem label="Asteroid Diameter" value={input_params.diameter_m} unit="m" />
          <DetailItem label="Impact Velocity" value={input_params.velocity_kms} unit="km/s" />
          <DetailItem label="Estimated Mass" value={input_params.mass_kg_str} unit="kg" />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-yellow-300">Impact Consequences</h3>
         <div className="bg-yellow-900/20 p-4 rounded-lg">
          <DetailItem label="Explosive Energy" value={impact_effects.energy_megatons} unit="Megatons TNT" colorClass="text-yellow-400" />
          <DetailItem label="Crater Diameter" value={impact_effects.crater_diameter_km} unit="km" colorClass="text-yellow-400" />
          <DetailItem label="Seismic Magnitude" value={impact_effects.seismic_magnitude_mw} unit="Mw" colorClass="text-yellow-400" />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/50">
        <p className="text-sm text-blue-200 text-center leading-relaxed italic">
          "{analogy}"
        </p>
      </div>

       {data.is_ml_prediction && 
            <p className="text-center text-purple-300 bg-purple-900/50 p-2 rounded-md text-sm mt-4">
                🤖 This result was predicted using Artificial Intelligence.
            </p>
        }

        <PopulationImpactCard info={populationInfo} />
        <SocialShare data={data} />
    </div>
  );
};

export default ImpactDetailsPanel;