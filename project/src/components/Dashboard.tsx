import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { getProfile } from '../utils/dataUtils';
import { predictWeightChange } from '../utils/nutritionUtils';
import {
  Activity,
  Flame,
  Target,
  Apple,
  TrendingUp,
  Lightbulb,
  TrendingDown,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { todayData } = useData();
  const [profile, setProfile] = useState<any>(null);
  const [insight, setInsight] = useState('');
  const [weightPrediction, setWeightPrediction] = useState<any>(null);

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);

    // Generate insights
    const goal = savedProfile?.dailyCalorieGoal || 2000;
    const consumed = todayData.caloriesConsumed;
    const remaining = goal - consumed;

    if (consumed === 0) {
      setInsight('Start logging meals to track your nutrition!');
    } else if (remaining > 500) {
      setInsight("You're well below your goal. Make sure you're eating enough!");
    } else if (remaining > 0) {
      setInsight(`You have ${Math.round(remaining)} calories left today.`);
    } else if (remaining >= -200) {
      setInsight('Slightly over your goal, but still reasonable!');
    } else {
      setInsight(`You've exceeded your goal by ${Math.round(Math.abs(remaining))} calories.`);
    }

    // Calculate weight prediction including exercise calories
    if (savedProfile?.currentWeight) {
      const prediction = predictWeightChange(
        savedProfile.currentWeight,
        goal,
        todayData.caloriesConsumed,
        7, // 7 days prediction
        todayData.caloriesBurned // Include calories burned from exercise
      );
      setWeightPrediction(prediction);
    }
  }, [todayData]);

  const dailyGoal = profile?.dailyCalorieGoal || 2000;
  const remaining = dailyGoal - todayData.caloriesConsumed;
  const netCalories = todayData.caloriesConsumed - todayData.caloriesBurned;

  const stats = [
    {
      label: 'Daily Goal',
      value: dailyGoal,
      unit: 'cal',
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Consumed',
      value: todayData.caloriesConsumed,
      unit: 'cal',
      icon: Apple,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Burned',
      value: todayData.caloriesBurned,
      unit: 'cal',
      icon: Flame,
      color: 'bg-red-500',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Net Calories',
      value: netCalories,
      unit: 'cal',
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
    },
  ];

  const nutrients = [
    { label: 'Carbs', value: todayData.carbs, unit: 'g', color: 'text-blue-600' },
    { label: 'Protein', value: todayData.protein, unit: 'g', color: 'text-red-600' },
    { label: 'Fats', value: todayData.fats, unit: 'g', color: 'text-yellow-600' },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Your nutrition and fitness overview</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.color} rounded-lg p-5 text-white shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
                <p className="text-xs opacity-85 mb-1 font-medium">{stat.label}</p>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs opacity-70 mt-0.5">{stat.unit}</p>
              </div>
            );
          })}
        </div>

        {/* Enhanced Calorie Tracking Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Calories Consumed */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs sm:text-sm opacity-90 mb-2">Calories Consumed</p>
                <div className="text-2xl sm:text-4xl font-bold">{todayData.caloriesConsumed}</div>
                <p className="text-xs opacity-75 mt-2">from food & drinks</p>
              </div>
              <Apple size={32} className="opacity-20 hidden sm:block" />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
              <p className="text-xs opacity-90">Daily Goal: {dailyGoal} cal</p>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-2">Calories Burned</p>
                <div className="text-4xl font-bold">{todayData.caloriesBurned}</div>
                <p className="text-xs opacity-75 mt-2">from exercise</p>
              </div>
              <Flame size={40} className="opacity-20" />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
              <p className="text-xs opacity-90">{todayData.exerciseLogs?.length || 0} workouts logged</p>
            </div>
          </div>

          {/* Net Calories */}
          <div className={`bg-gradient-to-br ${netCalories < dailyGoal ? 'from-green-400 to-green-600' : 'from-purple-400 to-purple-600'} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-2">Net Calories</p>
                <div className="text-4xl font-bold">{netCalories}</div>
                <p className="text-xs opacity-75 mt-2">{netCalories < dailyGoal ? 'under' : 'over'} goal</p>
              </div>
              <TrendingUp size={40} className="opacity-20" />
            </div>
            <div className={`rounded-lg p-3 mt-4 ${netCalories < dailyGoal ? 'bg-green-300 bg-opacity-30' : 'bg-purple-300 bg-opacity-30'}`}>
              <p className="text-xs opacity-90">{Math.abs(dailyGoal - netCalories)} cal {netCalories < dailyGoal ? 'remaining' : 'excess'}</p>
            </div>
          </div>
        </div>

        {/* Calorie Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target size={24} className="text-blue-600" />
            Calorie Breakdown
          </h2>
          <div className="space-y-6">
            {/* Consumed vs Goal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Consumed</span>
                <span className="text-sm font-bold text-orange-600">{todayData.caloriesConsumed} / {dailyGoal} cal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min((todayData.caloriesConsumed / dailyGoal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{(todayData.caloriesConsumed / dailyGoal * 100).toFixed(0)}% of daily goal</p>
            </div>

            {/* Net Calories After Exercise */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Net (After Exercise)</span>
                <span className="text-sm font-bold text-green-600">{netCalories} cal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${netCalories < dailyGoal ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-purple-400 to-purple-600'}`}
                  style={{ width: `${Math.min((netCalories / dailyGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span>{netCalories > dailyGoal ? '↑ Over' : '↓ Under'} goal</span>
                <span className="font-semibold">{Math.abs(dailyGoal - netCalories)} cal</span>
              </div>
            </div>

            {/* Calorie Breakdown Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Consumed */}
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{todayData.caloriesConsumed}</p>
                <p className="text-xs text-gray-600 mt-1">Consumed</p>
              </div>

              {/* Burned */}
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">-{todayData.caloriesBurned}</p>
                <p className="text-xs text-gray-600 mt-1">Burned</p>
              </div>

              {/* Net */}
              <div className={`text-center p-3 rounded-lg ${netCalories < dailyGoal ? 'bg-green-50' : 'bg-purple-50'}`}>
                <p className={`text-2xl font-bold ${netCalories < dailyGoal ? 'text-green-600' : 'text-purple-600'}`}>{netCalories}</p>
                <p className="text-xs text-gray-600 mt-1">Net Calories</p>
              </div>

              {/* Remaining */}
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{Math.max(0, remaining)}</p>
                <p className="text-xs text-gray-600 mt-1">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Remaining Calories */}
          <div className="bg-blue-500 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Remaining</p>
            <div className="text-3xl font-bold">{Math.max(0, remaining)}</div>
            <p className="text-xs opacity-75 mt-2">calories left</p>
          </div>

          {/* Current Weight */}
          <div className="bg-cyan-500 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Current Weight</p>
            <div className="text-3xl font-bold">{profile?.currentWeight || '--'}</div>
            <p className="text-xs opacity-75 mt-2">kg</p>
          </div>

          {/* Weight Goal */}
          <div className="bg-pink-500 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Weight Goal</p>
            <div className="text-3xl font-bold capitalize">{profile?.weightGoal || '--'}</div>
            <p className="text-xs opacity-75 mt-2">kg target</p>
          </div>
        </div>

        {/* Weight Prediction Card */}
        {weightPrediction && profile?.currentWeight && (
          <div className="bg-white rounded-lg shadow-lg p-7 mb-8 border-t-4 border-purple-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} className="text-purple-600" />
              Weight Prediction
            </h2>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
              {/* Current Status */}
              <div>
                <p className="text-sm text-gray-600 mb-3 font-semibold">Your Current Status</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Current Weight:</span>
                    <span className="text-lg font-bold text-gray-900">{weightPrediction.currentWeight} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Calories Consumed:</span>
                    <span className="text-lg font-bold text-orange-600">{todayData.caloriesConsumed} cal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Calories Burned:</span>
                    <span className="text-lg font-bold text-red-600">{todayData.caloriesBurned} cal</span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 border-t border-gray-200 ${weightPrediction.calorieDeficit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="font-semibold">Calorie Deficit:</span>
                    <span className="text-lg font-bold">{weightPrediction.calorieDeficit > 0 ? '+' : ''}{weightPrediction.calorieDeficit} cal/day</span>
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div>
                <p className="text-sm text-gray-600 mb-3 font-semibold">Weight Predictions Based on Today's Activity</p>
                <div className="space-y-3">
                  {/* 7 Days */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">In 7 Days:</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${
                          weightPrediction.predictedWeightIn7Days < weightPrediction.currentWeight ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {weightPrediction.predictedWeightIn7Days} kg
                        </span>
                        {weightPrediction.predictedWeightIn7Days < weightPrediction.currentWeight ? (
                          <TrendingDown size={18} className="text-green-600" />
                        ) : (
                          <TrendingUp size={18} className="text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 30 Days */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">In 30 Days:</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${
                          weightPrediction.predictedWeightIn30Days < weightPrediction.currentWeight ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {weightPrediction.predictedWeightIn30Days} kg
                        </span>
                        {weightPrediction.predictedWeightIn30Days < weightPrediction.currentWeight ? (
                          <TrendingDown size={18} className="text-green-600" />
                        ) : (
                          <TrendingUp size={18} className="text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            {todayData.caloriesConsumed > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">💡 Tip:</span> These predictions are based on maintaining today's activity level. Add more exercise or reduce meal portions to increase weight loss.
              </p>
            )}
            {todayData.caloriesConsumed === 0 && (
              <p className="text-sm text-gray-500 italic">📝 Log meals today to see accurate weight predictions</p>
            )}
          </div>
        )}

        {/* Exercise Plan Section */}
        {todayData.exerciseLogs && todayData.exerciseLogs.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-7 mb-8 border-t-4 border-slate-400">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={24} className="text-slate-600" />
              Today's Workouts
            </h2>
            <div className="space-y-3">
              {todayData.exerciseLogs.map((exercise, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{exercise.name}</p>
                    <p className="text-sm text-gray-600">{exercise.duration} min • {exercise.caloriesBurned} cal burned</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-700">{exercise.caloriesBurned}</p>
                    <p className="text-xs text-gray-500">calories</p>
                  </div>
                </div>
              ))}
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 mt-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total Burned:</span> {todayData.caloriesBurned} calories from {todayData.exerciseLogs.length} workout(s)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Macronutrients */}
        <div className="bg-white rounded-lg shadow-lg p-7 mb-8 border-t-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={24} className="text-blue-600" />
            Today's Macronutrients
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {nutrients.map((nutrient, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 text-center border border-gray-200">
                <p className={`text-3xl font-bold ${nutrient.color}`}>
                  {nutrient.value}
                </p>
                <p className="text-gray-700 text-sm font-semibold mt-2">{nutrient.label}</p>
                <p className="text-gray-500 text-xs mt-1">{nutrient.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insight Card */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-lg p-6 flex items-start gap-4 border border-slate-300">
          <Lightbulb className="text-slate-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">📌 Today's Insight</h3>
            <p className="text-gray-700">{insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
