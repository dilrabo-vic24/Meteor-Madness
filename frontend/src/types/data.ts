export type TrajectoryData = {
  name: string;
  spk_id: string;
  positions: number[];
};

export type ImpactData = {
  name: string;
  input_params: {
    diameter_m: number;
    velocity_kms: number;
    mass_kg_str: string;
  };
  impact_effects: {
    energy_megatons: number;
    crater_diameter_km: number;
    seismic_magnitude_mw: number;
  };
  analogy: string;
};


// ... TrajectoryData va ImpactData ...

// <-- YANGI TIP -->
export type NearEarthObject = {
  id: string;
  neo_reference_id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: {
    miss_distance: {
      kilometers: string;
    };
  }[];
};