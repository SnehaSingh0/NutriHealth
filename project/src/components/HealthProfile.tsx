import React, { useState, useEffect } from 'react';
import { getProfile, saveProfile } from '../utils/dataUtils';
import { getApiUrl } from '../config/api';
import { User, Edit2, Save, X, TrendingUp, Target, Activity } from 'lucide-react';

const HealthProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [medicalSuggestions, setMedicalSuggestions] = useState<string[]>([]);
  const [showMedicalSuggestions, setShowMedicalSuggestions] = useState(false);

  // Comprehensive list of medical conditions (same as HealthAssessment)
  const medicalConditionsList = [
    'Hypertension (High Blood Pressure)',
    'Low Blood Pressure',
    'Heart Disease',
    'Diabetes Type 1',
    'Diabetes Type 2',
    'Prediabetes',
    'PCOS (Polycystic Ovary Syndrome)',
    'Hyperthyroidism',
    'Hypothyroidism',
    'Thyroid Disorder',
    'Asthma',
    'Chronic Obstructive Pulmonary Disease (COPD)',
    'Sleep Apnea',
    'Celiac Disease',
    'Irritable Bowel Syndrome (IBS)',
    'Arthritis',
    'Osteoporosis',
    'Rheumatoid Arthritis',
    'Migraine',
    'Epilepsy',
    'Depression',
    'Anxiety Disorder',
  ];

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setFormData(savedProfile);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'medicalCondition') {
      // Handle medical condition search
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // Filter suggestions
      if (value && value.length > 0) {
        const filtered = medicalConditionsList.filter(condition =>
          condition.toLowerCase().includes(value.toLowerCase())
        );
        setMedicalSuggestions(filtered);
        setShowMedicalSuggestions(true);
      } else {
        setMedicalSuggestions(medicalConditionsList);
        setShowMedicalSuggestions(false);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) : value,
      }));
    }
  };

  const selectMedicalCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medicalCondition: condition,
    }));
    setShowMedicalSuggestions(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const updatedProfile = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);

      // Also sync to backend
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          await fetch(getApiUrl('/api/profile'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              age: formData.age,
              weight: formData.weight,
              height: formData.height,
              gender: formData.gender,
              activity_level: formData.activityLevel,
              goal: formData.goal,
              blood_pressure: formData.bloodPressure,
              medical_condition: formData.medicalCondition,
              health_factors: formData.healthFactors,
              other_conditions: formData.otherConditions,
            }),
          });
        } catch (err) {
          console.log('Backend sync failed, but profile saved locally');
        }
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateCalorieGoal = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    goal: string
  ): number => {
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const tdee = bmr * 1.55;

    switch (goal) {
      case 'lose':
        return Math.round(tdee * 0.85);
      case 'gain':
        return Math.round(tdee * 1.1);
      default:
        return Math.round(tdee);
    }
  };

  if (!profile && !editing) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Health Profile</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center py-12">
            <p className="text-gray-600 mb-4">No profile found</p>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <User size={32} className="text-blue-600" />
            Health Profile
          </h1>
          <p className="text-gray-600">Manage your personal health information</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Main Grid - Profile Panel + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Panel - 2 columns */}
          <div className="lg:col-span-2">

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {!editing ? (
            <>
              {/* Display Mode */}
              <div className="space-y-6 mb-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Age</p>
                    <p className="text-3xl font-bold text-blue-600">{profile?.age}</p>
                    <p className="text-xs text-gray-500 mt-1">years old</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Weight</p>
                    <p className="text-3xl font-bold text-blue-600">{profile?.weight}</p>
                    <p className="text-xs text-gray-500 mt-1">kg</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Height</p>
                    <p className="text-3xl font-bold text-purple-600">{profile?.height}</p>
                    <p className="text-xs text-gray-500 mt-1">cm</p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Daily Goal</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {profile?.dailyCalorieGoal}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">calories</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                    <p className="text-sm text-gray-600 mb-2">Gender</p>
                    <p className="text-lg font-bold text-pink-600 capitalize">
                      {profile?.gender}
                    </p>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-6 border border-cyan-200">
                    <p className="text-sm text-gray-600 mb-2">Activity Level</p>
                    <p className="text-lg font-bold text-cyan-600 capitalize">
                      {profile?.activityLevel}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Weight Goal</p>
                    <p className="text-lg font-bold text-green-600 capitalize">
                      {profile?.goal}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <p className="text-sm text-gray-600 mb-2">BMI</p>
                    <p className="text-lg font-bold text-red-600">
                      {profile?.bmi?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{profile?.bmiCategory}</p>
                  </div>
                </div>

                {/* Medical Conditions */}
                {(profile?.bloodPressure || profile?.medicalCondition || profile?.healthFactors || profile?.otherConditions) && (
                  <div className="border-t-2 border-blue-100 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {profile?.bloodPressure && (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                          <p className="text-base font-semibold text-yellow-700">{profile.bloodPressure}</p>
                        </div>
                      )}
                      {profile?.medicalCondition && (
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Medical Condition</p>
                          <p className="text-base font-semibold text-orange-700 capitalize">{profile.medicalCondition.replace(/_/g, ' ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 size={20} />
                Edit Profile
              </button>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                {/* Medical Conditions Section */}
                <div className="border-t-2 border-blue-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information (Optional)</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Blood Pressure Status
                    </label>
                    <input
                      type="text"
                      name="bloodPressure"
                      value={formData.bloodPressure || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Normal/High/Low or 120/80"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Medical Condition
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="medicalCondition"
                        value={formData.medicalCondition || ''}
                        onChange={handleInputChange}
                        onFocus={() => {
                          if (!formData.medicalCondition) {
                            setMedicalSuggestions(medicalConditionsList);
                          }
                          setShowMedicalSuggestions(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowMedicalSuggestions(false), 200);
                        }}
                        placeholder="Type to search... (e.g., diabetes, heart, asthma)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Searchable Suggestions Dropdown - Google-like */}
                      {showMedicalSuggestions && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {medicalSuggestions.length > 0 ? (
                            medicalSuggestions.map((condition, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectMedicalCondition(condition)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-b-0 text-sm text-gray-800 font-medium flex items-center gap-3 group"
                              >
                                <span className="text-gray-400 group-hover:text-blue-600">🔍</span>
                                <span className="flex-1">{condition}</span>
                                <span className="text-gray-400 text-xs group-hover:text-blue-600">↵</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500 text-sm">
                              No conditions found matching "{formData.medicalCondition}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(profile);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
          </div>

          {/* Sidebar - Health Summary and Tips */}
          <div className="lg:col-span-1">
            {profile && (
              <div className="space-y-6">
                {/* Health Summary Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp size={24} />
                    <h3 className="text-xl font-bold">Your Summary</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-blue-100">BMI</p>
                      <p className="text-2xl font-bold">{profile.bmi?.toFixed(1) || 'N/A'}</p>
                      <p className="text-xs text-blue-100 capitalize">{profile.bmiCategory}</p>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-blue-100">Daily Goal</p>
                      <p className="text-2xl font-bold">{profile.dailyCalorieGoal}</p>
                      <p className="text-xs text-blue-100">calories/day</p>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-blue-100">Weight Goal</p>
                      <p className="text-xl font-bold capitalize">{profile.goal}</p>                    <p className="text-xs text-blue-100 mt-1">✎ Editable in profile</p>                    </div>
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={24} className="text-amber-600" />
                    <h3 className="text-lg font-bold text-gray-900">Recommendations</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    {(() => {
                      const getBMIRecommendation = () => {
                        if (!profile.bmi) return null;
                        if (profile.bmi < 18.5) return 'Gain Weight';
                        if (profile.bmi >= 18.5 && profile.bmi < 25) return 'Maintain Weight';
                        return 'Lose Weight';
                      };

                      const getMealPlanInfo = () => {
                        if (profile.goal === 'lose') {
                          return 'Check the Personalized Diet page for calorie-deficit meal plans tailored to you';
                        } else if (profile.goal === 'gain') {
                          return 'Check the Personalized Diet page for calorie-surplus meal plans with protein focus';
                        }
                        return 'Check the Personalized Diet page for balanced meal plans';
                      };

                      return (
                        <>
                          <div className="bg-white rounded-lg p-3 border border-amber-100">
                            <p className="font-semibold text-amber-900">Weight Goal: {getBMIRecommendation()}</p>
                            <p className="text-gray-600 mt-1 text-xs">{getMealPlanInfo()}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-amber-100">
                            <p className="font-semibold text-amber-900">Activity Level: {profile.activityLevel}</p>
                            <p className="text-gray-600 mt-1 text-xs">Maintain consistency with your activity routine</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Activity Tips Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity size={24} className="text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Quick Tips</h3>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Track your meals regularly for accurate calorie monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Stay hydrated throughout the day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Get enough sleep for optimal metabolism</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Check personalized diet for AI recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
