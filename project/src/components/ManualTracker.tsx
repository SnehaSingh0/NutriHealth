import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { getProfile } from '../utils/dataUtils';
import { predictWeightChange } from '../utils/nutritionUtils';
import { Plus, X, Utensils, TrendingDown, Lightbulb, Zap, AlertCircle } from 'lucide-react';
import FoodAutocomplete from './FoodAutocomplete';
import { getFoodNutrition, getAllUnits, FOOD_DATABASE, FOOD_CATEGORIES } from '../data/foodDatabase';

const ManualTracker: React.FC = () => {
  const { addFood, removeFood, todayData } = useData();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'grams',
    calories: '',
    carbs: '',
    protein: '',
    fats: '',
  });
  const [availableUnits, setAvailableUnits] = useState<string[]>(['grams']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [predictedWeight, setPredictedWeight] = useState<number | null>(null);
  const [tip, setTip] = useState('');

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
  }, []);

  // Update available units when food is selected
  useEffect(() => {
    if (formData.name) {
      const units = getAllUnits(formData.name);
      setAvailableUnits(units);
      setFormData(prev => ({ ...prev, unit: units[0] }));
    }
  }, [formData.name]);

  // Auto-calculate nutrition and generate tips
  useEffect(() => {
    if (formData.quantity && formData.name) {
      const nutrition = getFoodNutrition(formData.name, parseFloat(formData.quantity), formData.unit);
      setFormData(prev => ({
        ...prev,
        calories: nutrition.calories.toString(),
        carbs: nutrition.carbs.toString(),
        protein: nutrition.protein.toString(),
        fats: nutrition.fats.toString(),
      }));
    }

    // Generate tip based on current intake
    if (profile?.dailyCalorieGoal) {
      const totalCalories = todayData.caloriesConsumed + (parseInt(formData.calories) || 0);
      const remaining = profile.dailyCalorieGoal - totalCalories;

      if (remaining > 500) {
        setTip('💪 You still have plenty of room for more meals!');
      } else if (remaining > 0 && remaining <= 500) {
        setTip('✅ You\'re getting close to your daily goal!');
      } else if (remaining < 0 && remaining >= -200) {
        setTip('⚠️ You\'re slightly over but still balanced!');
      } else if (remaining < -200) {
        setTip('🛑 You\'re significantly over your goal. Consider lighter meals next.');
      }

      // Calculate predicted weight after this meal
      if (profile?.currentWeight) {
        const prediction = predictWeightChange(
          profile.currentWeight,
          profile.dailyCalorieGoal,
          totalCalories,
          7
        );
        setPredictedWeight(prediction.predictedWeightIn7Days);
      }
    }
  }, [formData.quantity, formData.name, formData.unit, formData.calories, todayData, profile]);

  const handleFoodSelect = (foodName: string, unit: string) => {
    setFormData(prev => ({
      ...prev,
      name: foodName,
      unit: unit,
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = e.target.value;
    setFormData(prev => ({ ...prev, quantity }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = e.target.value;
    setFormData(prev => ({ ...prev, unit }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Food name is required');
      return false;
    }
    if (!formData.calories || parseFloat(formData.calories) < 0) {
      setError('Valid calorie amount is required');
      return false;
    }
    return true;
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const newFood = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      calories: parseInt(formData.calories),
      carbs: parseFloat(formData.carbs) || 0,
      protein: parseFloat(formData.protein) || 0,
      fats: parseFloat(formData.fats) || 0,
      quantity: parseFloat(formData.quantity) || 0,
      unit: formData.unit,
      time: new Date().getTime(),
      timestamp: new Date().toISOString(),
    };

    addFood(newFood);
    setSuccess(`✅ "${formData.name}" logged! +${formData.calories} cal`);
    setFormData({ name: '', quantity: '', unit: 'grams', calories: '', carbs: '', protein: '', fats: '' });

    setTimeout(() => setSuccess(''), 3000);
  };

  const goalRemaining = profile ? profile.dailyCalorieGoal - todayData.caloriesConsumed : 0;
  const goalPercentage = profile ? (todayData.caloriesConsumed / profile.dailyCalorieGoal) * 100 : 0;

  return (
    <div className="flex-1 min-w-0 overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Manual Food Tracker
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Log meals, track nutrition, get smart recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Daily Progress Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border border-blue-200 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={20} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">Daily Progress</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{todayData.caloriesConsumed}</p>
            <p className="text-xs text-blue-600 mt-1">
              {goalRemaining > 0
                ? `${Math.round(goalRemaining)} cal remaining`
                : `${Math.round(Math.abs(goalRemaining))} cal over goal`}
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(goalPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Weight Prediction Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6 border border-green-200 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={20} className="text-green-600" />
              <p className="text-sm font-semibold text-green-900">7-Day Prediction</p>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {predictedWeight ? predictedWeight.toFixed(1) : profile?.currentWeight || '--'} kg
            </p>
            <p className="text-xs text-green-600 mt-1">Based on current intake & goals</p>
          </div>

          {/* Macros Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 sm:p-6 border border-purple-200 min-w-0 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Utensils size={20} className="text-purple-600 shrink-0" />
              <p className="text-sm font-semibold text-purple-900">Today's Macros</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-2 text-sm">
              <p className="text-purple-700 min-w-0">🥩 Protein: <span className="font-bold">{Math.round(todayData.protein)}g</span></p>
              <p className="text-purple-700 min-w-0">🌾 Carbs: <span className="font-bold">{Math.round(todayData.carbs)}g</span></p>
              <p className="text-purple-700 min-w-0">🥑 Fats: <span className="font-bold">{Math.round(todayData.fats)}g</span></p>
            </div>
          </div>
        </div>

        {/* Main Form & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Add Food Entry</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleAddFood} className="space-y-5">
              {/* Food Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🍽️ Select or Search Food *
                </label>
                <FoodAutocomplete
                  value={formData.name}
                  onChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                  onSelect={handleFoodSelect}
                  placeholder="Type food name... (e.g., chapati, pizza, apple)"
                />
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="e.g., 2"
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={handleUnitChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Calories * (Auto-calculated)</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="Auto-calculated..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Macros */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.carbs}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.protein}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fats (g)</label>
                  <input
                    type="number"
                    value={formData.fats}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Log This Food
              </button>
            </form>
          </div>

          {/* Smart Tips Sidebar */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-yellow-200 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={22} className="text-yellow-600" />
              <h3 className="font-bold text-yellow-900">Smart Tips</h3>
            </div>

            <div className="space-y-4">
              {tip && (
                <div className="p-3 bg-white rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              )}

              {profile && (
                <>
                  <div className="p-3 bg-white rounded-lg border border-yellow-200">
                    <p className="text-xs font-bold text-yellow-900 mb-1">📊 Your Goal Today</p>
                    <p className="text-sm text-gray-700">{profile.dailyCalorieGoal} calories</p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-yellow-200">
                    <p className="text-xs font-bold text-yellow-900 mb-1">🎯 Weight Goal</p>
                    <p className="text-sm text-gray-700 capitalize">{profile.goal}</p>
                  </div>

                  {profile.diabetes && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs font-bold text-red-900">🩺 Diabetes</p>
                      <p className="text-xs text-red-700">Focus on low-glycemic foods</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Today's Food Log</h2>

          {todayData.foodLogs.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No foods logged yet</p>
              <p className="text-gray-400 text-sm">Start by adding your first meal above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayData.foodLogs.map((food) => (
                <div
                  key={food.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h4 className="font-semibold text-gray-900 break-words">
                        {food.name}
                        {food.quantity && (
                          <span className="block sm:inline text-sm text-gray-500 sm:ml-2 font-normal">
                            ({food.quantity} {food.unit})
                          </span>
                        )}
                      </h4>
                      <span className="shrink-0 self-start sm:self-auto bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {food.calories} cal
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                      <span>🌾 {food.carbs}g</span>
                      <span>🥩 {food.protein}g</span>
                      <span>🥑 {food.fats}g</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFood(food.id)}
                    className="self-end sm:self-auto text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    aria-label={`Remove ${food.name}`}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              {/* Daily Summary */}
              <div className="mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-blue-300 min-w-0 overflow-x-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 min-w-0">
                  <div>
                    <p className="text-xs text-gray-600">Total Calories</p>
                    <p className="text-xl font-bold text-blue-700">{todayData.caloriesConsumed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Protein</p>
                    <p className="text-xl font-bold text-blue-700">{Math.round(todayData.protein)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Carbs</p>
                    <p className="text-xl font-bold text-blue-700">{Math.round(todayData.carbs)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Fats</p>
                    <p className="text-xl font-bold text-blue-700">{Math.round(todayData.fats)}g</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualTracker;
