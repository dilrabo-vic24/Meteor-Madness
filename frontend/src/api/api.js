// To'liq manzilni ko'rsatamiz, bu frontend va backend alohida ishlayotganda eng ishonchli usul
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Yerga yaqin asteroidlar ro'yxatini oladi.
 */
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

/**
 * Berilgan asteroid ID'si bo'yicha uning trayektoriyasini oladi.
 */
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

/**
 * Berilgan asteroid ID'si bo'yicha uning zarba oqibatlarini hisoblaydi.
 */
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

/**
 * (YANGI) ML modeli yordamida zarba oqibatlarini tezkor bashorat qiladi.
 */
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

/**
 * (YANGI) Zarba nuqtasi va krater diametri bo'yicha aholiga ta'sirini oladi.
 */
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
    // Missiya targetini ro'yxat ko'rinishida qaytaramiz, boshqa komponentlar moslashishi uchun
    return [await response.json()]; 
  } catch (error) {
    console.error("Missiya nishonini yuklashda xatolik:", error);
    throw error;
  }
};