import aiohttp
from fastapi import HTTPException
from app.core.config import settings

BASE_URL = "https://api.nasa.gov/neo/rest/v1"

def get_fictional_impactor_data():
    """ "Impactor-2025" uchun xayoliy, ammo realistik ma'lumotlarni qaytaradi."""
    return {
        "name": "Impactor-2025 (Fictional Mission Target)",
        "id": "999999",
        "neo_reference_id": "Impactor-2025",
        "is_potentially_hazardous_asteroid": True, # Missiya uchun muhim
        "estimated_diameter": {
            "meters": {
                "estimated_diameter_min": 140,
                "estimated_diameter_max": 310,
            }
        },
        "close_approach_data": [
            {
                "relative_velocity": {
                    "kilometers_per_second": "25.5"
                },
                 "miss_distance": {
                    "kilometers": "0" # To'g'ridan-to'g'ri zarba
                }
            }
        ],
        "orbital_data": { # Trayektoriya uchun ma'lumotlar
            "semi_major_axis": "1.8",
            "eccentricity": "0.55",
            "inclination": "15.0",
            "ascending_node_longitude": "180.0",
            "perihelion_argument": "270.0",
            "mean_anomaly": "30.0"
        }
    }

async def get_asteroid_data(spk_id: str):
    """Berilgan ID bo'yicha asteroid ma'lumotlarini oladi (haqiqiy yoki xayoliy)."""
    if spk_id == "Impactor-2025":
        return get_fictional_impactor_data()

    if not settings.NASA_API_KEY:
        raise HTTPException(status_code=500, detail="NASA_API_KEY topilmadi!")

    url = f"{BASE_URL}/neo/{spk_id}?api_key={settings.NASA_API_KEY}"
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status, detail="NASA API'dan asteroid ma'lumotlarini olishda xato")
                return await response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"NASA bilan bog'lanishda xatolik: {str(e)}")


async def get_real_near_earth_objects_for_today():
    """FAQAT HAQIQIY ob'ektlarni NASA'dan oladi."""
    if not settings.NASA_API_KEY or settings.NASA_API_KEY == "YOUR_API_KEY_HERE":
        # Agar API kaliti bo'lmasa, test uchun bo'sh ro'yxat qaytaramiz
        print("OGOHLANTIRISH: NASA_API_KEY sozlanmagan. Haqiqiy asteroidlar yuklanmaydi.")
        return []

    url = f"{BASE_URL}/feed/today?detailed=false&api_key={settings.NASA_API_KEY}"
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    today_str = list(data['near_earth_objects'].keys())[0]
                    return data['near_earth_objects'][today_str]
                else:
                    print(f"OGOHLANTIRISH: NASA API'dan real NEO ro'yxatini olib bo'lmadi. Status: {response.status}")
                    return []
        except Exception as e:
            print(f"OGOHLANTIRISH: NASA API bilan bog'lanishda xatolik: {str(e)}")
            return []