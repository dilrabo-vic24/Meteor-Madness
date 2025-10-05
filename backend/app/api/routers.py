from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import nasa_service, physics_service, geo_service
from app.ml import ml_service

import numpy as np

router = APIRouter()

class PopulationImpactRequest(BaseModel):
    latitude: float
    longitude: float
    crater_km: float

@router.get("/neos/today", tags=["Asteroid Data"])
async def get_real_today_neos_route():
    """Faqat HAQIQIY Yerga yaqin asteroidlar ro'yxatini qaytaradi."""
    return await nasa_service.get_real_near_earth_objects_for_today()

@router.get("/missions/impactor-2025", tags=["Mission Data"])
async def get_mission_target_route():
    """Missiya uchun mo'ljallangan yagona, xayoliy "Impactor-2025" asteroidi ma'lumotini qaytaradi."""
    return nasa_service.get_fictional_impactor_data()

@router.get("/asteroid/{spk_id}", tags=["Asteroid Data"])
async def get_trajectory_route(spk_id: str):
    """Berilgan asteroid ID (haqiqiy yoki 'Impactor-2025') bo'yicha trayektoriya nuqtalarini hisoblaydi."""
    try:
        asteroid_data = await nasa_service.get_asteroid_data(spk_id)
        orbit_params = asteroid_data['orbital_data']
        trajectory_points = physics_service.calculate_trajectory_points(orbit_params)
        return {"positions": trajectory_points, "name": asteroid_data.get('name', '')}
    except KeyError:
        raise HTTPException(status_code=404, detail=f"'{spk_id}' uchun orbital ma'lumotlar topilmadi.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/impact_effects/{spk_id}", tags=["Simulation"])
async def get_impact_effects_route(spk_id: str):
    """To'liq fizik hisob-kitoblarga asoslangan zarba oqibatlarini qaytaradi."""
    try:
        asteroid_data = await nasa_service.get_asteroid_data(spk_id)
        return physics_service.calculate_impact_physics(asteroid_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predict_impact_ml/{spk_id}", tags=["AI Prediction"])
async def predict_impact_ml_route(spk_id: str):
    """ML modeli yordamida zarba oqibatlarini tezkor bashorat qiladi."""
    try:
        asteroid_data = await nasa_service.get_asteroid_data(spk_id)
        
        diameter_data = asteroid_data['estimated_diameter']['meters']
        diameter_m = diameter_data.get('estimated_diameter_mean', (diameter_data.get('estimated_diameter_min', 10) + diameter_data.get('estimated_diameter_max', 50)) / 2.0)
        velocity_kms = float(asteroid_data['close_approach_data'][0]['relative_velocity']['kilometers_per_second'])
        
        predicted_effects = ml_service.predict_impact(diameter_m, velocity_kms)
        
        impact_latitude = np.random.uniform(-60, 60)
        impact_longitude = np.random.uniform(-180, 180)
        
        return {
            "name": asteroid_data.get('name', ''),
            "input_params": {"diameter_m": round(diameter_m, 2), "velocity_kms": round(velocity_kms, 2)},
            "impact_effects": predicted_effects,
            "impact_location": {"latitude": round(impact_latitude, 4), "longitude": round(impact_longitude, 4)},
            "analogy": f"Bu zarba taxminan {predicted_effects['energy_megatons']} megatonna TNT portlashiga teng (AI bashorati)."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML bashoratida xatolik: {str(e)}")

@router.post("/population_impact", tags=["Regional Analysis"])
async def get_population_impact_route(request: PopulationImpactRequest):
    """Berilgan koordinatalar va krater o'lchami bo'yicha aholiga ta'sirni hisoblaydi."""
    try:
        impact_radius_km = (request.crater_km / 2) * 1.5
        population = await geo_service.get_population_from_coords(
            latitude=request.latitude,
            longitude=request.longitude,
            radius_km=impact_radius_km
        )
        
        return {
            "affected_population": population,
            "zone_radius_km": round(impact_radius_km, 2),
            "note": "Aholi soni zarba nuqtasiga eng yaqin aholi punkti ma'lumotlari asosida olingan."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aholi ma'lumotlarini hisoblashda xatolik: {str(e)}")