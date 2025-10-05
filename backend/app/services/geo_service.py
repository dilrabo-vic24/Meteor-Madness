
import aiohttp
from fastapi import HTTPException

GEONAMES_USERNAME = "demo" 
BASE_URL = "http://api.geonames.org/findNearbyJSON"

async def get_population_from_coords(latitude: float, longitude: float, radius_km: float):
    """
    GeoNames API yordamida berilgan koordinatalarga eng yaqin aholi punktining
    aholisi sonini oladi. Bu usul juda tez va fayl talab qilmaydi.
    """
    params = {
        "lat": latitude,
        "lng": longitude,
        "radius": radius_km, 
        "featureClass": "P", 
        "style": "full",
        "maxRows": 1,
        "username": GEONAMES_USERNAME,
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(BASE_URL, params=params) as response:
                if response.status != 200:
                    print(f"GeoNames API xatosi: {response.status}")
                    return 0 

                data = await response.json()
                
                if not data.get("geonames"):
                    return 0

                population = data["geonames"][0].get("population", 0)
                return int(population)

        except Exception as e:
            print(f"GeoNames API bilan bog'lanishda xatolik: {str(e)}")
            return 0