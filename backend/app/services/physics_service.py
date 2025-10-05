import numpy as np

# --- ORBITAL MEXANIKA ---
def solve_kepler(M, e, tolerance=1e-6):
    E = M
    for _ in range(100):
        dE = (M - (E - e * np.sin(E))) / (1 - e * np.cos(E))
        E += dE
        if abs(dE) < tolerance: break
    return E

def calculate_trajectory_points(orbit_params, num_points=365):
    # ... (kod o'zgarishsiz, avvalgidek qoladi)
    e = float(orbit_params['eccentricity'])
    a_au = float(orbit_params['semi_major_axis'])
    i_deg, om_deg, w_deg, ma_deg = map(float, [
        orbit_params['inclination'],
        orbit_params['ascending_node_longitude'],
        orbit_params['perihelion_argument'],
        orbit_params['mean_anomaly']
    ])
    
    a = a_au * 1.496e11
    i, om, w, ma = np.radians([i_deg, om_deg, w_deg, ma_deg])
    
    mu = 1.327e20
    n = np.sqrt(mu / a**3)
    
    trajectory_coords = []
    for t_delta_days in range(num_points):
        t_delta_seconds = t_delta_days * 86400
        M = ma + n * t_delta_seconds
        E = solve_kepler(M, e)
        nu = 2 * np.arctan2(np.sqrt(1 + e) * np.sin(E / 2), np.sqrt(1 - e) * np.cos(E / 2))
        r = a * (1 - e * np.cos(E))
        
        x_orb = r * np.cos(nu)
        y_orb = r * np.sin(nu)
        
        x = x_orb * (np.cos(w)*np.cos(om) - np.sin(w)*np.cos(i)*np.sin(om)) - y_orb * (np.sin(w)*np.cos(om) + np.cos(w)*np.cos(i)*np.sin(om))
        y = x_orb * (np.cos(w)*np.sin(om) + np.sin(w)*np.cos(i)*np.cos(om)) + y_orb * (np.cos(w)*np.cos(i)*np.cos(om) - np.sin(w)*np.sin(om))
        z = x_orb * (np.sin(w)*np.sin(i)) + y_orb * (np.cos(w)*np.sin(i))
        
        trajectory_coords.extend([x, y, z])
    return trajectory_coords

# --- ZARBA FIZIKASI ---
def calculate_impact_physics(asteroid_data):
    # ... (kod o'zgarishsiz, avvalgidek qoladi)
    diameter_data = asteroid_data['estimated_diameter']['meters']
    if 'estimated_diameter_mean' in diameter_data:
        diameter_m = diameter_data['estimated_diameter_mean']
    else:
        min_diam = diameter_data['estimated_diameter_min']
        max_diam = diameter_data['estimated_diameter_max']
        diameter_m = (min_diam + max_diam) / 2.0
        
    close_approach_data = asteroid_data['close_approach_data'][0]
    velocity_kms = float(close_approach_data['relative_velocity']['kilometers_per_second'])
    velocity_ms = velocity_kms * 1000
    density_kgm3 = 3000

    radius_m = diameter_m / 2
    volume_m3 = (4/3) * np.pi * (radius_m**3)
    mass_kg = volume_m3 * density_kgm3

    kinetic_energy_joules = 0.5 * mass_kg * (velocity_ms**2)
    energy_megatons = kinetic_energy_joules / 4.184e15

    # Formulalar soddalashtirilgan, realistik natijalar uchun o'zgartirilishi mumkin
    crater_diameter_m = 1.16 * (density_kgm3 / 2750)**(1/3) * (kinetic_energy_joules)**0.28
    seismic_magnitude_mw = (2/3) * np.log10(kinetic_energy_joules) - 6.07
    
    # Zarba joylashuvini taxminiy aniqlash (bu yerda soddalashtirilgan)
    impact_latitude = np.random.uniform(-60, 60)
    impact_longitude = np.random.uniform(-180, 180)
    
    return {
        "name": asteroid_data.get('name', ''),
        "input_params": {
            "diameter_m": round(diameter_m, 2), "velocity_kms": round(velocity_kms, 2), "mass_kg_str": f"{mass_kg:.2e}"
        },
        "impact_effects": {
            "energy_megatons": round(energy_megatons, 2),
            "crater_diameter_km": round(crater_diameter_m / 1000, 2),
            "seismic_magnitude_mw": round(seismic_magnitude_mw, 1)
        },
        "impact_location": {
            "latitude": round(impact_latitude, 4),
            "longitude": round(impact_longitude, 4)
        },
        "analogy": f"Bu zarba taxminan {round(energy_megatons, 2)} megatonna TNT portlashiga teng, bu Xirosimaga tashlangan bombadan ~{int(energy_megatons*1000/15)} marta kuchliroqdir."
    }