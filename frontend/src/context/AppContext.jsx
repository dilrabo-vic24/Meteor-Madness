import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getNearEarthObjects, fetchTrajectory } from '../api/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [neoList, setNeoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [trajectory, setTrajectory] = useState(null);
  const [isFetchingTrajectory, setIsFetchingTrajectory] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await getNearEarthObjects();
        
        // --- YECHIM: Ma'lumotlar kelayotganini tekshirish ---
        console.log("Fetched asteroids from API:", data); // Brauzer konsolida ko'ring
        
        // API javobi `near_earth_objects` maydoniga o'ralgan bo'lishi mumkin
        if (data && data.near_earth_objects) {
          setNeoList(data.near_earth_objects);
        } else if (Array.isArray(data)) {
          setNeoList(data);
        } else {
          // Agar format noma'lum bo'lsa
          setNeoList([]);
        }

      } catch (err) {
        setError("Could not download the list of asteroids.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const selectAsteroid = useCallback(async (spkId, name) => {
    // ... bu qism o'zgarishsiz qoladi
    if (selectedAsteroid?.spk_id === spkId) return;
    setIsFetchingTrajectory(true);
    setTrajectory(null);
    setError(null);
    if (spkId) {
        setSelectedAsteroid({ spk_id: spkId, name: name });
    } else {
        setSelectedAsteroid(null);
        setIsFetchingTrajectory(false);
        return;
    }
    try {
        const trajData = await fetchTrajectory(spkId);
        if (!trajData.positions || trajData.positions.length === 0) {
            throw new Error("Trajectory data is empty or invalid.");
        }
        setTrajectory({ ...trajData, name });
    } catch (err) {
        console.error("Error loading trajectory:", err);
        setError("Could not load trajectory for the selected asteroid.");
        setSelectedAsteroid(null); 
    } finally {
        setIsFetchingTrajectory(false);
    }
  }, [selectedAsteroid]);

  const value = {
    neoList,
    isLoading,
    error,
    selectedAsteroid,
    trajectory,
    isFetchingTrajectory,
    selectAsteroid,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};