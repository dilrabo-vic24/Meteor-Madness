import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "models/impact_predictor.joblib"
_model = None

def get_model():
    """Modelni faqat bir marta xotiraga yuklaydi."""
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model fayli topilmadi: {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model

def predict_impact(diameter_m: float, velocity_kms: float, density_kgm3: float = 3000):
    """Berilgan parametrlar uchun zarba oqibatlarini bashorat qiladi."""
    model = get_model()
    
    # Modelga ma'lumotni 2D massiv formatida berish kerak
    input_features = np.array([[diameter_m, velocity_kms, density_kgm3]])
    
    # Bashorat qilish
    prediction = model.predict(input_features)
    
    # Natijani formatlash
    predicted_effects = prediction[0]
    return {
        "energy_megatons": round(predicted_effects[0], 2),
        "crater_diameter_km": round(predicted_effects[1], 2),
        "seismic_magnitude_mw": round(predicted_effects[2], 1)
    }