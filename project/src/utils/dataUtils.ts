import { DailyData, FoodLog, ExerciseLog } from '../types';
import { getTodayDate, getYesterdayDate } from './dateUtils';

const STORAGE_KEY_PREFIX = 'nutrihealth_daily_';
/** Single source of truth for the localStorage key (must match App routing checks). */
export const HEALTH_PROFILE_STORAGE_KEY = 'health_profile';
const HISTORY_KEY = 'nutrihealth_history';

/** Presence of the key — use this instead of truthiness (`getItem` is truthy for the string `"false"`). */
export function hasHealthProfileInStorage(): boolean {
  return localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY) !== null;
}

/** Must use strict string check: `getItem` returns `"false"` for unseen welcome, which is truthy in JS. */
export function hasSeenHealthWelcomeInStorage(): boolean {
  return localStorage.getItem('has_seen_welcome') === 'true';
}

/**
 * After login, if the device has no local profile but the API returns one, persist it for App routing.
 * Expects the `profile` object from GET /api/profile (snake_case fields).
 */
export function persistServerProfileIfPresent(apiProfile: Record<string, unknown> | null | undefined): void {
  if (!apiProfile || typeof apiProfile !== 'object') return;

  const age = apiProfile.age;
  const weight = apiProfile.weight;
  const height = apiProfile.height;
  const gender = apiProfile.gender;
  if (age == null || weight == null || height == null || gender == null || gender === '') return;

  const completed =
    apiProfile.completed_assessment === 1 ||
    apiProfile.completed_assessment === true;

  const local = {
    age: Number(age),
    weight: Number(weight),
    height: Number(height),
    gender: String(gender),
    activityLevel: String(apiProfile.activity_level ?? 'moderate'),
    goal: 'maintain',
    dailyCalorieGoal: Number(apiProfile.daily_calorie_goal) || 0,
    bmi: apiProfile.bmi != null ? Number(apiProfile.bmi) : undefined,
    bmiCategory:
      apiProfile.bmi_category != null ? String(apiProfile.bmi_category) : '',
    bloodPressure: '',
    medicalCondition: '',
    createdAt:
      typeof apiProfile.created_at === 'string'
        ? apiProfile.created_at
        : new Date().toISOString(),
  };

  saveProfile(local);
  if (completed) {
    localStorage.setItem('has_seen_welcome', 'true');
  }
}

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
  localStorage.setItem(HEALTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  localStorage.setItem('profile_completed_once', 'true');
};

export const getProfile = (): any => {
  const stored = localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const hasCompletedProfileOnce = (): boolean => {
  return localStorage.getItem('profile_completed_once') === 'true';
};

export const clearTodayData = (): void => {
  const key = `${STORAGE_KEY_PREFIX}${getTodayDate()}`;
  localStorage.removeItem(key);
};
