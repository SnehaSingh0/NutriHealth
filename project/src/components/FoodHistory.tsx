import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { formatDate, getTodayDate, getYesterdayDate } from '../utils/dateUtils';
import { getDailyData, getProfile } from '../utils/dataUtils';
import { predictWeightChange } from '../utils/nutritionUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const FoodHistory: React.FC = () => {
  const { todayData, yesterdayData } = useData();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [displayData, setDisplayData] = useState(todayData);
  const [profile, setProfile] = useState<any>(null);
  const [insight, setInsight] = useState('');
  const [weightPrediction, setWeightPrediction] = useState<any>(null);

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
  }, []);

  useEffect(() => {
    const data = getDailyData(selectedDate);
    setDisplayData(data);

    // Generate insight for selected date
    if (data.caloriesConsumed === 0) {
      setInsight('No meals logged for this day.');
    } else {
      const goal = profile?.dailyCalorieGoal || 2000;
      const difference = goal - data.caloriesConsumed;
      
      if (difference > 0) {
        setInsight(`Balanced day - ${Math.round(difference)} calories under goal.`);
      } else if (difference >= -200) {
        setInsight('Slightly exceeded calorie goal, but within acceptable range.');
      } else {
        setInsight(`Exceeded calorie goal by ${Math.round(Math.abs(difference))} calories.`);
      }
    }

    // Calculate weight prediction for this date
    if (profile?.currentWeight && data.caloriesConsumed > 0) {
      const prediction = predictWeightChange(
        profile.currentWeight,
        profile?.dailyCalorieGoal || 2000,
        data.caloriesConsumed,
        7
      );
      setWeightPrediction(prediction);
    } else {
      setWeightPrediction(null);
    }
  }, [selectedDate, profile]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const dateStr = newDate.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const isToday = selectedDate === getTodayDate();
  const dayName = formatDate(selectedDate);

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-gray-900 mb-3">📊 Food History</h1>
          <p className="text-lg text-gray-600 font-medium">View your daily nutrition intake, exercise, and weight projections</p>
        </div>

        {/* Date Navigation */}
        <div className="bg-white rounded-xl shadow-md p-7 mb-10 border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-3 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Calendar size={22} className="text-blue-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-900"
                />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">{dayName}</h2>
              {isToday && (
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Today</span>
              )}
            </div>

            <button
              onClick={() => handleDateChange(1)}
              className="p-3 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 transition-all"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 text-center border border-orange-200 shadow-sm">
            <p className="text-xs font-bold text-orange-700 uppercase mb-2 tracking-wide">Meals</p>
            <p className="text-3xl font-black text-orange-600">{displayData.foodLogs.length}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 text-center border border-red-200 shadow-sm">
            <p className="text-xs font-bold text-red-700 uppercase mb-2 tracking-wide">Calories</p>
            <p className="text-3xl font-black text-red-600">{displayData.caloriesConsumed}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 text-center border border-yellow-200 shadow-sm">
            <p className="text-xs font-bold text-yellow-700 uppercase mb-2 tracking-wide">Protein</p>
            <p className="text-3xl font-black text-yellow-600">{Math.round(displayData.protein)}<span className="text-lg">g</span></p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200 shadow-sm">
            <p className="text-xs font-bold text-blue-700 uppercase mb-2 tracking-wide">Carbs</p>
            <p className="text-3xl font-black text-blue-600">{Math.round(displayData.carbs)}<span className="text-lg">g</span></p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center border border-purple-200 shadow-sm">
            <p className="text-xs font-bold text-purple-700 uppercase mb-2 tracking-wide">Fats</p>
            <p className="text-3xl font-black text-purple-600">{Math.round(displayData.fats)}<span className="text-lg">g</span></p>
          </div>
        </div>

        {/* Food Logs */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🍽️</span>Foods Logged
          </h3>
          {displayData.foodLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No meals logged for this day.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayData.foodLogs.map((food, idx) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-white rounded-lg hover:shadow-md transition-all border border-orange-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">#{idx + 1}</span>
                      <h4 className="font-bold text-gray-900 text-lg">{food.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      ⏰ {new Date(food.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-black text-orange-600">{food.calories}</p>
                    <p className="text-xs text-gray-500 font-semibold">calories</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercise Logs */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">💪</span>Workouts
          </h3>
          {displayData.exerciseLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No exercises logged for this day.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayData.exerciseLogs.map((exercise, idx) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white rounded-lg hover:shadow-md transition-all border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">#{idx + 1}</span>
                      <h4 className="font-bold text-gray-900 text-lg capitalize">{exercise.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">⏱️ {exercise.duration} minutes</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-black text-slate-700">{exercise.caloriesBurned}</p>
                    <p className="text-xs text-gray-500 font-semibold">burned</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weight Prediction Card */}
        {weightPrediction && profile?.currentWeight && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-10 border-t-4 border-purple-500">
            <h3 className="text-2xl font-black text-gray-900 mb-7 flex items-center gap-3">
              <span className="text-3xl">⚡</span>Weight Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Weight */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Current Weight</p>
                <p className="text-4xl font-black text-gray-900">{weightPrediction.currentWeight}<span className="text-xl">kg</span></p>
              </div>

              {/* Projected in 7 days */}
              <div className={`rounded-lg p-6 text-center border-2 ${
                weightPrediction.predictedWeightIn7Days < weightPrediction.currentWeight 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                  : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-300'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{
                  color: weightPrediction.predictedWeightIn7Days < weightPrediction.currentWeight ? '#166534' : '#be123c'
                }}>In 7 Days</p>
                <p className={`text-4xl font-black flex items-center justify-center gap-2 ${
                  weightPrediction.predictedWeightIn7Days < weightPrediction.currentWeight 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {weightPrediction.predictedWeightIn7Days}
                  {weightPrediction.predictedWeightIn7Days < weightPrediction.currentWeight ? (
                    <TrendingDown size={28} />
                  ) : (
                    <TrendingUp size={28} />
                  )}
                </p>
              </div>

              {/* Projected in 30 days */}
              <div className={`rounded-lg p-6 text-center border-2 ${
                weightPrediction.predictedWeightIn30Days < weightPrediction.currentWeight 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                  : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-300'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{
                  color: weightPrediction.predictedWeightIn30Days < weightPrediction.currentWeight ? '#166534' : '#be123c'
                }}>In 30 Days</p>
                <p className={`text-4xl font-black flex items-center justify-center gap-2 ${
                  weightPrediction.predictedWeightIn30Days < weightPrediction.currentWeight 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {weightPrediction.predictedWeightIn30Days}
                  {weightPrediction.predictedWeightIn30Days < weightPrediction.currentWeight ? (
                    <TrendingDown size={28} />
                  ) : (
                    <TrendingUp size={28} />
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Insight Card */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md p-7 border border-slate-300">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-slate-600 flex-shrink-0 mt-1" size={28} />
            <div className="flex-1">
              <h3 className="font-black text-gray-900 mb-2 text-lg">💡 Daily Insight</h3>
              <p className="text-gray-700 font-medium leading-relaxed">{insight}</p>
              {displayData.caloriesBurned > 0 && (
                <p className="text-sm text-gray-600 mt-3 font-medium">
                  🔥 You burned <span className="font-bold text-slate-700">{displayData.caloriesBurned} calories</span> through exercise today.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodHistory;
