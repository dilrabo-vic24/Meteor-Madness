import React from 'react';

const AsteroidList = ({ neoList, isLoading, selectedSpkId, onSelect }) => {
  if (isLoading) {
    return <p className="text-center text-gray-400 animate-pulse">Loading NEOs...</p>;
  }

  if (!neoList || neoList.length === 0) {
      return <p className="text-center text-gray-500">No asteroids found.</p>;
  }

  return (
    // O'ZGARISH: `h-` bilan balandlik chegaralandi va `custom-scrollbar` klassi qo'shildi
    <ul className="space-y-2 h-[calc(100vh-150px)] overflow-y-auto pr-2 custom-scrollbar">
      {neoList.map(neo => {
        const isSelected = neo.neo_reference_id === selectedSpkId;
        const isHazardous = neo.is_potentially_hazardous_asteroid;

        return (
          <li
            key={neo.id}
            onClick={() => onSelect(neo)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 
                        border-l-4 ${isHazardous ? 'border-red-500/80' : 'border-transparent'}
                        ${isSelected 
                            ? 'bg-cyan-600 scale-105 shadow-lg shadow-cyan-500/20' 
                            : 'bg-gray-800/60 hover:bg-gray-700/80'
                        }`}
          >
            <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
              {neo.name.replace(/[()]/g, '')}
            </p>
            {isHazardous && !isSelected && (
                <p className="text-xs text-red-400 mt-1">Potentially Hazardous</p>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AsteroidList;