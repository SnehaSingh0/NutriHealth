import React, { useState } from 'react';
import { getProfile } from '../utils/dataUtils';
import { Heart, Activity, Target, TrendingUp, Info } from 'lucide-react';

interface HealthWelcomeProps {
  onContinue: () => void;
}

const getMedicalConditionInfo: { [key: string]: { icon: string; description: string; recommendations: string[] } } = {
  diabetes: {
    icon: '🩺',
    description: 'Monitor blood sugar levels, focus on low-glycemic foods',
    recommendations: ['Focus on low-glycemic foods', 'Monitor sugar intake', 'Regular meals', 'Increase fiber'],
  },
  thyroid: {
    icon: '⚕️',
    description: 'Include iodine-rich foods, maintain regular meal times',
    recommendations: ['Iodine-rich foods', 'Maintain regular schedule', 'Limit cruciferous vegetables raw', 'Regular check-ups'],
  },
  bloodPressure: {
    icon: '❤️',
    description: 'Reduce salt intake, increase potassium-rich foods',
    recommendations: ['Reduce salt intake', 'Increase potassium', 'Stay active', 'Manage stress'],
  },
};

const HealthWelcome: React.FC<HealthWelcomeProps> = ({ onContinue }) => {
  const [profile] = useState(() => getProfile());
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  if (!profile) {
    return null;
  }

  // Calculate weight recommendation based on BMI
  const getBMIRecommendation = () => {
    if (!profile.bmi) return null;
    if (profile.bmi < 18.5) return 'Gain Weight';
    if (profile.bmi >= 18.5 && profile.bmi < 25) return 'Maintain Weight';
    return 'Lose Weight';
  };

  const recommendation = getBMIRecommendation();

  const getMealPlanInfo = () => {
    if (profile.goal === 'lose') {
      return 'Check the Personalized Diet page for calorie-deficit meal plans tailored to you';
    } else if (profile.goal === 'gain') {
      return 'Check the Personalized Diet page for calorie-surplus meal plans with protein focus';
    }
    return 'Check the Personalized Diet page for balanced meal plans';
  };

  const handleContinue = () => {
    localStorage.setItem('has_seen_welcome', 'true');
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome! 🎉</h1>
          <p className="text-xl text-gray-600">
            Your personalized health journey starts here
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="space-y-6">
          {/* Your Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={28} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Health Summary</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Age</p>
                <p className="text-3xl font-bold text-blue-700">{profile.age}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">BMI</p>
                <p className="text-3xl font-bold text-purple-700">{profile.bmi?.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">{profile.bmiCategory}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Daily Calories</p>
                <p className="text-3xl font-bold text-orange-700">{profile.dailyCalorieGoal}</p>
                <p className="text-xs text-gray-600 mt-1">calories/day</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Your Goal</p>
                <p className="text-2xl font-bold text-green-700 capitalize">{profile.goal}</p>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200 mt-6">
              <div className="flex items-center gap-3">
                <Target size={24} className="text-amber-600" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-amber-700">Based on your profile:</span> {recommendation}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    BMI: {profile.bmi?.toFixed(1)} • Activity: {profile.activityLevel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Conditions Card */}
          {(profile.diabetes || profile.thyroid || profile.bloodPressure || profile.otherConditions) && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-6">
                <Info size={28} className="text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Your Medical Profile</h2>
              </div>

              {/* Clickable condition buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.diabetes && (
                  <button
                    onClick={() => setSelectedCondition(selectedCondition === 'diabetes' ? null : 'diabetes')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCondition === 'diabetes'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    🩺 Diabetes
                  </button>
                )}
                {profile.thyroid && (
                  <button
                    onClick={() => setSelectedCondition(selectedCondition === 'thyroid' ? null : 'thyroid')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCondition === 'thyroid'
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    ⚕️ Thyroid
                  </button>
                )}
                {profile.bloodPressure && (
                  <button
                    onClick={() => setSelectedCondition(selectedCondition === 'bloodPressure' ? null : 'bloodPressure')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCondition === 'bloodPressure'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                    }`}
                  >
                    ❤️ Blood Pressure: {profile.bloodPressure}
                  </button>
                )}
                {profile.otherConditions && (
                  <button
                    onClick={() => setSelectedCondition(selectedCondition === 'otherConditions' ? null : 'otherConditions')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCondition === 'otherConditions'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    📋 {profile.otherConditions}
                  </button>
                )}
              </div>

              {/* Selected condition details */}
              {selectedCondition && getMedicalConditionInfo[selectedCondition] && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-3">
                    <span className="text-lg font-semibold">ℹ️ {getMedicalConditionInfo[selectedCondition].description}</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Key Recommendations:</p>
                  <ul className="space-y-1">
                    {getMedicalConditionInfo[selectedCondition].recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-blue-600">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Quick Tips Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-600">
            <div className="flex items-center gap-3 mb-6">
              <Activity size={28} className="text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Quick Tips to Get Started</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-start gap-3">
                <span className="text-xl">💧</span>
                <p className="text-sm text-gray-700"><span className="font-semibold">Hydration:</span> Drink water throughout the day</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
                <span className="text-xl">🍽️</span>
                <p className="text-sm text-gray-700"><span className="font-semibold">Nutrition:</span> {getMealPlanInfo()}</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-3">
                <span className="text-xl">📊</span>
                <p className="text-sm text-gray-700"><span className="font-semibold">Track:</span> Use Food Upload or Manual Tracker daily</p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-start gap-3">
                <span className="text-xl">✏️</span>
                <p className="text-sm text-gray-700"><span className="font-semibold">Edit Anytime:</span> Update your profile in Health Profile page</p>
              </div>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">🎯 Your Next Steps</h3>
            <ul className="space-y-2 text-blue-50 mb-6">
              <li className="flex items-center gap-3">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                Go to Dashboard to explore features
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Visit <span className="font-semibold">Personalized Diet</span> for AI meal recommendations</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                Start tracking your food daily
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                Check Exercise Plan for personalized workouts
              </li>
            </ul>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-lg"
          >
            Continue to Dashboard 🚀
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            💡 Tip: You can edit your health profile anytime from the Health Profile page in the sidebar
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthWelcome;
