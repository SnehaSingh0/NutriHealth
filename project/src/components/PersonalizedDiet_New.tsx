import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { getProfile } from '../utils/dataUtils';
import { Salad, Lightbulb, CheckCircle, AlertCircle, Globe } from 'lucide-react';

const PersonalizedDiet: React.FC = () => {
  const { todayData } = useData();
  const [profile, setProfile] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<'indian' | 'mediterranean' | 'balanced' | 'custom'>('indian');
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
  }, []);

  const mealPlans = {
    indian: {
      label: '🇮🇳 Indian Cuisine',
      description: 'Traditional Indian meals adapted to your health goals',
    },
    mediterranean: {
      label: '🇮🇹 Mediterranean Diet',
      description: 'Heart-healthy Mediterranean style meals',
    },
    balanced: {
      label: '⚖️ Balanced Mix',
      description: 'Varied international cuisines balanced for nutrition',
    },
    custom: {
      label: '✨ Custom Plan',
      description: 'Based on your preferences and medical conditions',
    },
  };

  const generateDietPlan = async () => {
    if (!profile) {
      setError('Please complete your health profile first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const plan = generatePersonalizedPlan(profile, selectedPlan);
      setDietPlan(plan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedPlan = (profile: any, planType: string) => {
    const { goal, dailyCalorieGoal, diabetes, thyroid, bloodPressure, otherConditions, activityLevel, weight, height, age, gender } = profile;

    const proteinTarget = Math.round(dailyCalorieGoal * 0.25 / 4);
    const carbsTarget = Math.round(dailyCalorieGoal * 0.45 / 4);
    const fatsTarget = Math.round(dailyCalorieGoal * 0.3 / 9);

    let plan: any = {
      goal,
      type: planType,
      macros: {
        protein: proteinTarget,
        carbs: carbsTarget,
        fats: fatsTarget,
        calories: dailyCalorieGoal,
      },
      shouldHave: [],
      shouldAvoid: [],
      meals: [],
      medicalNotes: [],
      tips: [],
    };

    // Base should-have items
    plan.shouldHave = [
      '🥗 Leafy greens and vegetables',
      '🥚 Lean protein sources',
      '🌾 Whole grains and complex carbs',
      '💧 Adequate water intake (8-10 glasses)',
      '🥜 Healthy fats (nuts, seeds, olive oil)',
      '🍎 Fresh fruits for vitamins',
    ];

    // Avoid items based on goal
    if (goal === 'lose') {
      plan.shouldAvoid = [
        '❌ sugary drinks and sodas',
        '❌ Processed foods and fried items',
        '❌ Excess oil and butter',
        '❌ High-calorie desserts',
        '❌ Alcohol (especially beer)',
        '❌ White bread and refined carbs',
      ];
      plan.tips.push('💡 Eat smaller portions, increase fiber, stay hydrated');
      plan.tips.push('💡 Focus on whole foods and home-cooked meals');
    } else if (goal === 'gain') {
      plan.shouldAvoid = [
        '❌ Very low-calorie foods',
        '❌ Excessive caffeine',
        '❌ Extreme exercise without eating',
      ];
      plan.tips.push('💡 Eat 5-6 smaller meals per day');
      plan.tips.push('💡 Include calorie-dense snacks: nuts, nut butters, avocado');
      plan.shouldHave.push('🥛 Full-fat milk and dairy products');
    } else {
      plan.shouldAvoid = [
        '❌ Excessive sweets and junk food',
        '❌ Too much salt',
        '❌ Trans fats',
      ];
      plan.tips.push('💡 Maintain consistent meal times');
      plan.tips.push('💡 Balance all food groups equally');
    }

    // Medical condition considerations
    if (diabetes) {
      plan.medicalNotes.push('🩺 Diabetes: Focus on low-glycemic foods, monitor sugar intake');
      plan.shouldHave.push('🌾 High-fiber foods (beans, whole grains)');
      plan.shouldAvoid.push('❌ Sugary foods and refined carbs');
    }

    if (thyroid) {
      plan.medicalNotes.push('🩺 Thyroid: Include iodine-rich foods, maintain regular meal times');
      plan.shouldHave.push('🥬 Iodine sources (fish, eggs, seaweed with moderation)');
    }

    if (bloodPressure) {
      plan.medicalNotes.push(`🩺 Blood Pressure (${bloodPressure}): Reduce salt intake, increase potassium`);
      plan.shouldHave.push('🥬 Potassium-rich foods (bananas, leafy greens, potatoes)');
      plan.shouldAvoid.push('❌ High-salt foods and processed items');
    }

    if (otherConditions) {
      plan.medicalNotes.push(`⚠️ Condition: ${otherConditions} - Consult healthcare provider for specific dietary needs`);
    }

    // Meal suggestions based on plan type
    if (planType === 'indian') {
      plan.meals = [
        {
          name: 'Breakfast (300-400 cal)',
          options: [
            '🥘 Oats with milk, banana and almonds',
            '🥘 Idli with sambar and coconut chutney',
            '🥘 Whole wheat paratha with yogurt',
          ],
        },
        {
          name: 'Mid-Morning Snack (150-200 cal)',
          options: [
            '🥤 Buttermilk lassi with spices',
            '🥜 Handful of roasted peanuts or almonds',
            '🍎 Fruit with yogurt',
          ],
        },
        {
          name: 'Lunch (400-500 cal)',
          options: [
            '🍛 Grilled tandoori chicken with brown rice and salad',
            '🍛 Dal with roti, seasonal vegetables curry',
            '🍛 Fish curry with quinoa and broccoli',
          ],
        },
        {
          name: 'Evening Snack (100-150 cal)',
          options: [
            '🥕 Vegetable salad or cucumber slices',
            '🍵 Green tea with nuts',
            '🥝 Fresh fruit',
          ],
        },
        {
          name: 'Dinner (400-500 cal)',
          options: [
            '🥘 Vegetable pulao with lean chicken and yogurt',
            '🥘 Lentil soup with whole wheat bread',
            '🥘 Paneer tikka with mixed vegetables',
          ],
        },
      ];
    } else if (planType === 'mediterranean') {
      plan.meals = [
        {
          name: 'Breakfast (300-400 cal)',
          options: [
            '🥗 Greek yogurt with berries and granola',
            '🍞 Whole grain toast with avocado and tomato',
            '🥚 Vegetable omelet with herbs',
          ],
        },
        {
          name: 'Lunch (400-500 cal)',
          options: [
            '🥗 Mediterranean salad with feta and olive oil dressing',
            '🐟 Grilled salmon with sweet potato and asparagus',
            '🌾 Whole wheat pasta with tomato and lean meat sauce',
          ],
        },
        {
          name: 'Dinner (400-500 cal)',
          options: [
            '🍗 Baked white fish with herbs and vegetables',
            '🥘 Vegetable stir-fry with chickpeas',
            '🥗 Large salad with chicken and quinoa',
          ],
        },
        {
          name: 'Snacks',
          options: [
            '🫒 Olive oil and whole grain bread',
            '🫐 Fresh berries',
            '🥜 Mixed nuts (small handul)',
          ],
        },
      ];
    } else {
      // Balanced plan
      plan.meals = [
        {
          name: 'Breakfast (300-400 cal)',
          options: [
            '🥣 Cereals with low-fat milk',
            '🥞 Whole wheat pancakes with honey',
            '🍌 Oatmeal with fruits',
          ],
        },
        {
          name: 'Mid-Morning (100-150 cal)',
          options: [
            '🍎 Fresh fruit',
            '🥤 Smoothie with yogurt',
            '🥜 Handful of almonds',
          ],
        },
        {
          name: 'Lunch (400-500 cal)',
          options: [
            '🥗 Salad with grilled chicken and whole grains',
            '🍝 Whole wheat pasta with vegetables',
            '🍲 Vegetable soup with lean protein',
          ],
        },
        {
          name: 'Afternoon (100-150 cal)',
          options: [
            '🍌 Fruit or protein bar',
            '🥕 Vegetables with hummus',
            '🍵 Tea with light snack',
          ],
        },
        {
          name: 'Dinner (400-500 cal)',
          options: [
            '🍗 Baked chicken with vegetables and rice',
            '🐟 Fish with sweet potato',
            '🥘 Vegetable curry with dal',
          ],
        },
      ];
    }

    return plan;
  };

  if (!profile) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile First</h2>
          <p className="text-gray-600 mb-4">
            Please complete your health profile in the Health Profile page to get personalized diet recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Salad size={32} className="text-blue-600" />
            Personalized Diet Plan
          </h1>
          <p className="text-gray-600">
            AI-powered meal recommendations based on your health profile and goals
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Object.entries(mealPlans).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedPlan(key as any);
                setDietPlan(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPlan === key
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <p className="font-bold text-gray-900">{value.label}</p>
              <p className="text-xs text-gray-600 mt-2">{value.description}</p>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateDietPlan}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mb-8 flex items-center justify-center gap-2"
        >
          <Lightbulb size={20} />
          {loading ? 'Generating Your Personalized Plan...' : 'Generate Your Plan'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-8">
            {error}
          </div>
        )}

        {/* Diet Plan Display */}
        {dietPlan && (
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Your Plan:</span> {mealPlans[selectedPlan as keyof typeof mealPlans].label} |
                <span className="font-bold ml-3">Goal:</span> {dietPlan.goal} |
                <span className="font-bold ml-3">Daily Calories:</span> {dietPlan.macros.calories} |
                <span className="font-bold ml-3">Protein:</span> {dietPlan.macros.protein}g |
                <span className="font-bold ml-3">Carbs:</span> {dietPlan.macros.carbs}g |
                <span className="font-bold ml-3">Fats:</span> {dietPlan.macros.fats}g
              </p>
            </div>

            {/* Medical Notes */}
            {dietPlan.medicalNotes.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Medical Considerations
                </h3>
                <div className="space-y-2">
                  {dietPlan.medicalNotes.map((note: string, index: number) => (
                    <p key={index} className="text-sm text-yellow-900">{note}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Should Have & Shouldn't Have */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Should Have
                </h3>
                <div className="space-y-2">
                  {dietPlan.shouldHave.map((item: string, index: number) => (
                    <p key={index} className="text-sm text-green-900">{item}</p>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Should Avoid
                </h3>
                <div className="space-y-2">
                  {dietPlan.shouldAvoid.map((item: string, index: number) => (
                    <p key={index} className="text-sm text-red-900">{item}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Meal Suggestions */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Globe size={20} />
                  Daily Meal Suggestions ({mealPlans[selectedPlan as keyof typeof mealPlans].label})
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {dietPlan.meals.map((meal: any, index: number) => (
                  <div key={index}>
                    <h4 className="font-bold text-gray-900 mb-3">{meal.name}</h4>
                    <div className="space-y-2">
                      {meal.options.map((option: string, optIndex: number) => (
                        <div
                          key={optIndex}
                          className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Lightbulb size={20} />
                Pro Tips
              </h3>
              <div className="space-y-2">
                {dietPlan.tips.map((tip: string, index: number) => (
                  <p key={index} className="text-sm text-purple-900">{tip}</p>
                ))}
                <p className="text-sm text-purple-900 mt-4">📊 Track your meals using the Food Upload or Manual Tracker feature</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedDiet;
