import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DailyData, FoodLog, ExerciseLog } from '../types';
import { getTodayDate, getYesterdayDate } from '../utils/dateUtils';
import {
  getTodayData,
  getYesterdayData,
  addFoodLog,
  addExerciseLog,
  removeFoodLog,
  removeExerciseLog,
  saveDailyData,
} from '../utils/dataUtils';

interface DataContextType {
  todayData: DailyData;
  yesterdayData: DailyData;
  refresh: () => void;
  addFood: (food: FoodLog) => void;
  addExercise: (exercise: ExerciseLog) => void;
  removeFood: (foodId: string) => void;
  removeExercise: (exerciseId: string) => void;
  updateDailyData: (data: DailyData) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [todayData, setTodayData] = useState<DailyData>(getTodayData());
  const [yesterdayData, setYesterdayData] = useState<DailyData>(getYesterdayData());

  const refresh = useCallback(() => {
    setTodayData(getTodayData());
    setYesterdayData(getYesterdayData());
  }, []);

  const addFood = useCallback((food: FoodLog) => {
    addFoodLog(food, getTodayDate());
    refresh();
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('dataUpdated'));
  }, [refresh]);

  const addExercise = useCallback((exercise: ExerciseLog) => {
    addExerciseLog(exercise, getTodayDate());
    refresh();
    window.dispatchEvent(new Event('dataUpdated'));
  }, [refresh]);

  const removeFood = useCallback((foodId: string) => {
    removeFoodLog(foodId, getTodayDate());
    refresh();
    window.dispatchEvent(new Event('dataUpdated'));
  }, [refresh]);

  const removeExercise = useCallback((exerciseId: string) => {
    removeExerciseLog(exerciseId, getTodayDate());
    refresh();
    window.dispatchEvent(new Event('dataUpdated'));
  }, [refresh]);

  const updateDailyData = useCallback((data: DailyData) => {
    saveDailyData(data);
    refresh();
    window.dispatchEvent(new Event('dataUpdated'));
  }, [refresh]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      refresh();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleStorageChange);
    };
  }, [refresh]);

  return (
    <DataContext.Provider
      value={{
        todayData,
        yesterdayData,
        refresh,
        addFood,
        addExercise,
        removeFood,
        removeExercise,
        updateDailyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
