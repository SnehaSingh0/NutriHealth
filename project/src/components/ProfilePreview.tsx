import React from 'react';
import { getProfile } from '../utils/dataUtils';
import { User, Edit2, Heart, Activity } from 'lucide-react';

interface ProfilePreviewProps {
  onEdit: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ onEdit }) => {
  const profile = getProfile();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-gray-600">Your health profile is ready</p>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Health Overview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart size={24} className="text-blue-600" />
              Your Health Overview
            </h2>

            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Age</p>
                <p className="text-3xl font-bold text-blue-600">{profile.age}</p>
                <p className="text-xs text-gray-500 mt-1">years old</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Current Weight</p>
                <p className="text-3xl font-bold text-blue-600">{profile.weight}</p>
                <p className="text-xs text-gray-500 mt-1">kg</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Height</p>
                <p className="text-3xl font-bold text-purple-600">{profile.height}</p>
                <p className="text-xs text-gray-500 mt-1">cm</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">BMI</p>
                <p className="text-3xl font-bold text-orange-600">{profile.bmi?.toFixed(1) || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{profile.bmiCategory}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Activity size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Goal</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-base text-gray-600">Based on your BMI:</p>
                <p className="text-2xl font-bold text-blue-700">{recommendation}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Your current goal is set to: <span className="font-semibold capitalize">{profile.goal}</span>
              </p>
              <p className="text-sm text-blue-600 mt-3 flex items-center gap-1">
                💡 Daily Calorie Goal: <span className="font-bold">{profile.dailyCalorieGoal}</span> calories
              </p>
            </div>

            {/* Activity & Health Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-cyan-50 rounded-lg p-6 border border-cyan-200">
                <p className="text-sm text-gray-600 mb-2">Activity Level</p>
                <p className="text-lg font-bold text-cyan-600 capitalize">
                  {profile.activityLevel}
                </p>
              </div>

              <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                <p className="text-sm text-gray-600 mb-2">Gender</p>
                <p className="text-lg font-bold text-pink-600 capitalize">
                  {profile.gender}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Conditions Summary */}
          {(profile.bloodPressure || profile.diabetes || profile.thyroid || profile.otherConditions) && (
            <div className="border-t-2 border-blue-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.bloodPressure && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                    <p className="text-base font-semibold text-yellow-700">{profile.bloodPressure}</p>
                  </div>
                )}
                {profile.diabetes && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Diabetes</p>
                    <p className="text-base font-semibold text-orange-700">✓ Present</p>
                  </div>
                )}
                {profile.thyroid && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Thyroid Condition</p>
                    <p className="text-base font-semibold text-blue-700">✓ Present</p>
                  </div>
                )}
                {profile.otherConditions && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Other Conditions</p>
                    <p className="text-base font-semibold text-purple-700">{profile.otherConditions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <div className="border-t-2 border-blue-100 pt-6 mt-8">
            <button
              onClick={onEdit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Edit2 size={20} />
              <span>Edit Profile in Settings</span>
            </button>
            <p className="text-sm text-gray-600 text-center mt-3">
              Click above to edit your health information in the Health Profile page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
