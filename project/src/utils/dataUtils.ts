import { DailyData, FoodLog, ExerciseLog } from '../types';
import { getTodayDate, getYesterdayDate } from './dateUtils';

const STORAGE_KEY_PREFIX = 'nutrihealth_daily_';
const PROFILE_KEY = 'health_profile';
const HISTORY_KEY = 'nutrihealth_history';

export const initializeDailyData = (date: string): DailyData => {
  return {
    date,
    foodLogs: [],
    exerciseLogs: [],
    caloriesConsumed: 0,
    caloriesBurned: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
  };
};

export const getDailyData = (date: string): DailyData => {
  const key = `${STORAGE_KEY_PREFIX}${date}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initializeDailyData(date);
    }
  }
  
  return initializeDailyData(date);
};

export const saveDailyData = (data: DailyData): void => {
  const key = `${STORAGE_KEY_PREFIX}${data.date}`;
  localStorage.setItem(key, JSON.stringify(data));
};

export const getTodayData = (): DailyData => {
  return getDailyData(getTodayDate());
};

export const getYesterdayData = (): DailyData => {
  return getDailyData(getYesterdayDate());
};

export const addFoodLog = (foodLog: FoodLog, date: string = getTodayDate()): void => {
  const data = getDailyData(date);
  data.foodLogs.push(foodLog);
  data.caloriesConsumed += foodLog.calories;
  data.carbs += foodLog.carbs;
  data.protein += foodLog.protein;
  data.fats += foodLog.fats;
  saveDailyData(data);
};

export const addExerciseLog = (exerciseLog: ExerciseLog, date: string = getTodayDate()): void => {
  const data = getDailyData(date);
  data.exerciseLogs.push(exerciseLog);
  data.caloriesBurned += exerciseLog.caloriesBurned;
  saveDailyData(data);
};

export const removeFoodLog = (foodId: string, date: string = getTodayDate()): void => {
  const data = getDailyData(date);
  const foodLog = data.foodLogs.find(f => f.id === foodId);
  
  if (foodLog) {
    data.caloriesConsumed -= foodLog.calories;
    data.carbs -= foodLog.carbs;
    data.protein -= foodLog.protein;
    data.fats -= foodLog.fats;
    data.foodLogs = data.foodLogs.filter(f => f.id !== foodId);
    saveDailyData(data);
  }
};

export const removeExerciseLog = (exerciseId: string, date: string = getTodayDate()): void => {
  const data = getDailyData(date);
  const exerciseLog = data.exerciseLogs.find(e => e.id === exerciseId);
  
  if (exerciseLog) {
    data.caloriesBurned -= exerciseLog.caloriesBurned;
    data.exerciseLogs = data.exerciseLogs.filter(e => e.id !== exerciseId);
    saveDailyData(data);
  }
};

export const saveProfile = (profile: any): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  // Mark that user has completed profile setup
  localStorage.setItem('profile_completed_once', 'true');
};

export const getProfile = (): any => {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const hasCompletedProfileOnce = (): boolean => {
  return localStorage.getItem('profile_completed_once') === 'true';
};

export const clearTodayData = (): void => {
  const key = `${STORAGE_KEY_PREFIX}${getTodayDate()}`;
  localStorage.removeItem(key);
};
