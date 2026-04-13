// Nutrition and health recommendation engine

export const calculateBMI = (weight: number, heightCm: number): { bmi: number; category: string; description: string } => {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  
  let category = 'Normal Weight';
  let description = 'You are at a healthy weight. Maintain with balanced diet and regular activity.';
  
  if (bmi < 18.5) {
    category = 'Underweight';
    description = 'Your weight is below healthy range. Focus on nutrient-dense foods and adequate calories.';
  } else if (bmi < 25) {
    category = 'Normal Weight';
    description = 'You are at a healthy weight. Maintain with balanced diet and regular activity.';
  } else if (bmi < 30) {
    category = 'Overweight';
    description = 'Consider a moderate calorie deficit and increase physical activity.';
  } else {
    category = 'Obese';
    description = 'Consult a healthcare professional for personalized guidance.';
  }
  
  return { bmi: Math.round(bmi * 10) / 10, category, description };
};

export const calculateCalorieGoal = (
  weight: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'moderate' | 'active',
  goal: 'lose' | 'gain' | 'maintain'
): number => {
  // Mifflin-St Jeor equation for BMR
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
  }

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,      // Little or no exercise
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Intense exercise 6-7 days/week
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  // Goal adjustment
  switch (goal) {
    case 'lose':
      return Math.round(tdee * 0.85); // 15% deficit = ~0.5 kg/week
    case 'gain':
      return Math.round(tdee * 1.1); // 10% surplus
    default:
      return Math.round(tdee); // maintenance
  }
};

export const getRecommendations = (
  bmiCategory: string,
  goal: 'lose' | 'gain' | 'maintain'
): { dietType: string; focusFoods: string[]; avoidFoods: string[]; meals: string[] } => {
  const baseRecommendations: Record<string, any> = {
    Underweight: {
      dietType: 'High-Calorie Nutrient-Dense',
      focusFoods: ['Nuts', 'Avocados', 'Whole Milk', 'Protein', 'Dried Fruits'],
      avoidFoods: ['Low-calorie drinks', 'Empty calories'],
      meals: ['Frequent meals + snacks', 'Protein at every meal', 'Healthy oils'],
    },
    'Normal Weight': {
      dietType: 'Balanced Maintenance',
      focusFoods: ['Whole Grains', 'Lean Proteins', 'Vegetables', 'Fruits', 'Healthy Fats'],
      avoidFoods: ['Excess sugar', 'Ultra-processed foods'],
      meals: ['3 meals + 1-2 snacks', 'Mix macronutrients', 'Hydration'],
    },
    Overweight: {
      dietType: 'Balanced with Deficit',
      focusFoods: ['Vegetables', 'Lean Proteins', 'Whole Grains', 'Low-sugar fruits'],
      avoidFoods: ['Fried foods', 'Sugary drinks', 'High-fat dairy'],
      meals: ['Smaller portions', 'High fiber', 'Protein to stay full'],
    },
    Obese: {
      dietType: 'Medical Consultation Required',
      focusFoods: ['Consult healthcare professional', 'Vegetables', 'Lean Proteins'],
      avoidFoods: ['Fast food', 'Sugary beverages', 'Processed foods'],
      meals: ['Structured meal plan', 'Professional guidance'],
    },
  };

  return baseRecommendations[bmiCategory] || baseRecommendations['Normal Weight'];
};

export const getActivityLevelDescription = (level: 'sedentary' | 'moderate' | 'active'): string => {
  const descriptions = {
    sedentary: 'Little or no exercise',
    moderate: 'Moderate exercise 3-5 days/week',
    active: 'Intense exercise 6-7 days/week',
  };
  return descriptions[level];
};
