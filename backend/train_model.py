# train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

print("Sun'iy ma'lumotlar yaratilmoqda...")
data = []
for _ in range(5000):
    diameter_m = np.random.uniform(10, 2000)
    velocity_kms = np.random.uniform(11, 72)
    density_kgm3 = np.random.uniform(1500, 7000)
    
    radius_m = diameter_m / 2
    volume_m3 = (4/3) * np.pi * (radius_m**3)
    mass_kg = volume_m3 * density_kgm3
    kinetic_energy_joules = 0.5 * mass_kg * ((velocity_kms * 1000)**2)
    
    energy_megatons = kinetic_energy_joules / 4.184e15
    crater_diameter_km = (1.16 * (density_kgm3 / 2750)**(1/3) * (kinetic_energy_joules)**0.28) / 1000
    seismic_magnitude_mw = (2/3) * np.log10(kinetic_energy_joules) - 6.07
    
    data.append([diameter_m, velocity_kms, density_kgm3, energy_megatons, crater_diameter_km, seismic_magnitude_mw])

df = pd.DataFrame(data, columns=['diameter_m', 'velocity_kms', 'density_kgm3', 'energy_megatons', 'crater_diameter_km', 'seismic_magnitude_mw'])

X = df[['diameter_m', 'velocity_kms', 'density_kgm3']]
y = df[['energy_megatons', 'crater_diameter_km', 'seismic_magnitude_mw']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
print("Model o'qitilmoqda...")
model.fit(X_train, y_train)

print(f"Model aniqligi (R^2): {model.score(X_test, y_test):.4f}")

output_dir = 'backend/app/ml/models'
os.makedirs(output_dir, exist_ok=True)
model_path = os.path.join(output_dir, 'impact_predictor.joblib')
joblib.dump(model, model_path)

print(f"Model muvaffaqiyatli saqlandi: {model_path}")