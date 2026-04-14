export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  quantity: number;
  unit: string;
  time: number;
  timestamp: string;
}

export interface ExerciseLog {
  id: string;
  name: string;
  duration: number;
  durationUnit?: string;
  caloriesBurned: number;
  time: number;
  timestamp: string;
}

export interface DailyData {
  date: string; // YYYY-MM-DD
  foodLogs: FoodLog[];
  exerciseLogs: ExerciseLog[];
  caloriesConsumed: number;
  caloriesBurned: number;
  carbs: number;
  protein: number;
  fats: number;
}

export interface HealthProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  goal: 'lose' | 'gain' | 'maintain';
  dailyCalorieGoal: number;
  bmi: number;
  bmiCategory: string;
  bloodPressure?: string;
  diabetes?: boolean;
  thyroid?: boolean;
  otherConditions?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  /** False once auth is restored from storage and profile sync (if needed) has completed. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
