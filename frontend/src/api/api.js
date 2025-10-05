const API_BASE_URL = 'https://meteor-madness-4yd7.onrender.com/api';

export const getNearEarthObjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/neos/today`);
    if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("NEO ro'yxatini yuklashda xatolik:", error);
    throw error;
  }
};


export const fetchTrajectory = async (spkId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asteroid/${spkId}`);
    if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`"${spkId}" uchun traektoriyani yuklashda xatolik:`, error);
    throw error;
  }
};


export const fetchImpactEffects = async (spkId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/impact_effects/${spkId}`);
    if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`"${spkId}" uchun zarba effektlarini yuklashda xatolik:`, error);
    throw error;
  }
};


export const predictImpactML = async (spkId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict_impact_ml/${spkId}`);
    if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
    const data = await response.json();
    data.is_ml_prediction = true; // Javobga bu ML bashorati ekanligini belgilaymiz
    return data;
  } catch (error) {
    console.error(`"${spkId}" uchun ML bashoratini olishda xatolik:`, error);
    throw error;
  }
};

export const fetchPopulationImpact = async (latitude, longitude, crater_km) => {
    try {
        const response = await fetch(`${API_BASE_URL}/population_impact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude, crater_km }),
        });
        if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Aholiga ta'sir ma'lumotlarini olishda xatolik:", error);
        throw error;
    }
};

export const getMissionTarget = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/impactor-2025`);
    if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
    return [await response.json()]; 
  } catch (error) {
    console.error("Missiya nishonini yuklashda xatolik:", error);
    throw error;
  }
};