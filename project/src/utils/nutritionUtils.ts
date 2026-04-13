// Nutrition and weight prediction utilities

export interface FoodNutrition {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

export interface WeightPrediction {
  currentWeight: number;
  calorieDeficit: number;
  predictedWeightIn7Days: number;
  predictedWeightIn30Days: number;
  estimatedTimeToGoal: number; // in days
  hasMinimalEffect: boolean;
}

// Calculate weight prediction based on calorie surplus/deficit
// 3500 calories = approximately 1 pound (0.45 kg) of body weight
export const predictWeightChange = (
  currentWeight: number, // in kg
  dailyCalorieGoal: number,
  actualDailyCalories: number,
  daysToPredict: number = 7,
  caloriesBurned: number = 0 // calories burned from exercise
): WeightPrediction => {
  // Net calories = consumed - burned
  const netCalories = actualDailyCalories - caloriesBurned;
  const calorieDeficit = dailyCalorieGoal - netCalories; // Deficit if positive
  const weeklyCalorieChange = calorieDeficit * daysToPredict;
  const weightChangeKg = (weeklyCalorieChange / 7700); // 7700 calories ≈ 1kg body weight
  
  const predictedWeight = currentWeight + weightChangeKg;
  const hasMinimalEffect = Math.abs(weightChangeKg) < 0.2; // Less than 0.2kg change
  
  // Calculate days to reach weight goal
  let estimatedDaysToGoal = 999; // Default large number
  const goalWeight = currentWeight * 0.95; // Assuming 5% weight loss goal estimate
  if (calorieDeficit > 0) {
    estimatedDaysToGoal = Math.ceil((Math.abs(goalWeight - currentWeight) * 7700) / (calorieDeficit * 7));
  }
  
  return {
    currentWeight,
    calorieDeficit,
    predictedWeightIn7Days: Math.round(predictedWeight * 10) / 10,
    predictedWeightIn30Days: Math.round((currentWeight + (weightChangeKg * 30 / daysToPredict)) * 10) / 10,
    estimatedTimeToGoal: estimatedDaysToGoal,
    hasMinimalEffect,
  };
};

// Compare consumption against health profile goals
export interface HealthComparison {
  status: 'good' | 'warning' | 'danger';
  message: string;
  caloriePercentage: number;
  carbsOK: boolean;
  proteinOK: boolean;
  fatsOK: boolean;
}

export const compareWithHealthProfile = (
  consumption: FoodNutrition,
  dailyGoalCalories: number,
  profileConditions: string[]
): HealthComparison => {
  const caloriePercentage = Math.round((consumption.calories / dailyGoalCalories) * 100);
  
  // Daily macro targets (rough estimates for balanced diet)
  const targetCarbs = (dailyGoalCalories * 0.45) / 4; // 45% of calories from carbs (4 cal/g)
  const targetProtein = (dailyGoalCalories * 0.30) / 4; // 30% from protein (4 cal/g)
  const targetFats = (dailyGoalCalories * 0.25) / 9; // 25% from fats (9 cal/g)
  
  const carbsOK = consumption.carbs <= targetCarbs * 1.2; // Allow 20% overflow
  const proteinOK = consumption.protein >= targetProtein * 0.8; // At least 80% of target
  const fatsOK = consumption.fats <= targetFats * 1.2;
  
  let status: 'good' | 'warning' | 'danger' = 'good';
  let message = '✓ Within recommended intake';
  
  if (caloriePercentage > 100) {
    status = 'warning';
    message = `⚠ ${caloriePercentage}% of daily calorie goal`;
  }
  
  if (caloriePercentage > 130) {
    status = 'danger';
    message = `✕ ${caloriePercentage}% of daily calorie goal - Exceeding by ${caloriePercentage - 100}%`;
  }
  
  // Special conditions
  if (profileConditions.includes('Diabetes Type 1') || profileConditions.includes('Diabetes Type 2')) {
    if (consumption.carbs > (dailyGoalCalories * 0.40) / 4) {
      status = 'warning';
      message = '⚠ High carbs detected - Consider for diabetes management';
    }
  }
  
  if (profileConditions.includes('Hypertension')) {
    // High sodium indication (would need sodium data)
    message += ' | Monitor sodium intake';
  }
  
  return {
    status,
    message,
    caloriePercentage,
    carbsOK,
    proteinOK,
    fatsOK,
  };
};

// Format nutrition display
export const formatNutrition = (nutrition: FoodNutrition): string => {
  return `${Math.round(nutrition.calories)} cal • ${nutrition.carbs.toFixed(1)}g carbs • ${nutrition.protein.toFixed(1)}g protein • ${nutrition.fats.toFixed(1)}g fats`;
};

// Estimate meal type based on time of day
export const estimateMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snack';
  return 'dinner';
};

// Calculate BMI category health implications
export const getBMICategory = (bmi: number): { category: string; color: string; advice: string } => {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#3b82f6',
      advice: 'Focus on calorie surplus with nutritious foods'
    };
  } else if (bmi < 25) {
    return {
      category: 'Healthy Weight',
      color: '#10b981',
      advice: 'Maintain current weight with balanced nutrition'
    };
  } else if (bmi < 30) {
    return {
      category: 'Overweight',
      color: '#f59e0b',
      advice: 'Create mild calorie deficit and increase exercise'
    };
  } else {
    return {
      category: 'Obese',
      color: '#ef4444',
      advice: 'Consult healthcare provider for personalized weight management'
    };
  }
};

// Suggest calorie goal based on BMI and activity level
export const suggestCalorieGoal = (
  weight: number, // kg
  height: number, // cm
  activityLevel: 'low' | 'moderate' | 'high' | 'very_high',
  goal: 'lose_weight' | 'maintain' | 'gain_weight'
): number => {
  // Simplified BMR calculation (Mifflin-St Jeor)
  // Note: This is a simplified version without age/gender, use full formula in production
  const bmr = 10 * weight + 6.25 * height - 5 * 25; // Assuming ~25 age
  
  const activityMultipliers = {
    low: 1.2,
    moderate: 1.55,
    high: 1.725,
    very_high: 1.9
  };
  
  const tdee = bmr * activityMultipliers[activityLevel];
  
  const goalAdjustments = {
    lose_weight: 0.85, // 15% deficit
    maintain: 1.0,
    gain_weight: 1.1 // 10% surplus
  };
  
  return Math.round(tdee * goalAdjustments[goal]);
};
