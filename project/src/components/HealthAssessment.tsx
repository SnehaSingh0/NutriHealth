import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveProfile } from '../utils/dataUtils';
import { Heart, User, Loader, Ruler, Target, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { calculateBMI, calculateCalorieGoal, getRecommendations, getActivityLevelDescription } from '../data/nutritionEngine';

interface HealthAssessmentProps {
  onComplete: () => void;
}

const HealthAssessment: React.FC<HealthAssessmentProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: 'moderate' as 'sedentary' | 'moderate' | 'active',
    goal: 'maintain',
    bloodPressure: '',
    medicalCondition: '',
    customGoal: false, // Track if user wants custom goal
  });
  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string; description: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicalSuggestions, setMedicalSuggestions] = useState<string[]>([]);
  const [showMedicalSuggestions, setShowMedicalSuggestions] = useState(false);

  // Comprehensive list of medical conditions
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

  // Calculate BMI in real-time
  useEffect(() => {
    if (formData.weight && formData.height) {
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height);
      if (weight > 0 && height > 0) {
        const bmi = calculateBMI(weight, height);
        setBmiResult(bmi);
        
        // Auto-set goal to recommended if not customized
        if (!formData.customGoal) {
          if (bmi.bmi < 18.5) {
            setFormData(prev => ({ ...prev, goal: 'gain' }));
          } else if (bmi.bmi >= 18.5 && bmi.bmi < 25) {
            setFormData(prev => ({ ...prev, goal: 'maintain' }));
          } else {
            setFormData(prev => ({ ...prev, goal: 'lose' }));
          }
        }
      }
    }
  }, [formData.weight, formData.height, formData.customGoal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'goal') {
      // Mark as customized when user changes goal
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customGoal: true, // User is customizing the goal
      }));
    } else if (name === 'medicalCondition') {
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
        [name]: value,
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

  // Get recommendation based on BMI
  const getWeightRecommendation = () => {
    if (!bmiResult) return null;
    if (bmiResult.bmi < 18.5) return 'Gain Weight';
    if (bmiResult.bmi >= 18.5 && bmiResult.bmi < 25) return 'Maintain Weight';
    return 'Lose Weight';
  };

  const validateForm = (): boolean => {
    if (!formData.age || parseFloat(formData.age) <= 0) {
      setError('Valid age is required');
      return false;
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      setError('Valid weight is required');
      return false;
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      setError('Valid height is required');
      return false;
    }
    if (!formData.gender) {
      setError('Please select a gender');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height);
      const age = parseFloat(formData.age);

      // Calculate new calorie goal using the new engine with activity level
      const dailyCalorieGoal = calculateCalorieGoal(
        weight,
        height,
        age,
        formData.gender as 'male' | 'female',
        formData.activityLevel,
        formData.goal as 'lose' | 'gain' | 'maintain'
      );

      // Get BMI data
      const bmiData = calculateBMI(weight, height);

      const profile = {
        age: parseInt(formData.age),
        weight,
        height,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dailyCalorieGoal,
        bmi: bmiData.bmi,
        bmiCategory: bmiData.category,
        bloodPressure: formData.bloodPressure,
        medicalCondition: formData.medicalCondition,
        createdAt: new Date().toISOString(),
      };

      saveProfile(profile);

      // Also send to backend if user is logged in
      if (user) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            await fetch('http://localhost:5000/api/profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                age: parseInt(formData.age),
                weight,
                height,
                gender: formData.gender,
                activity_level: formData.activityLevel,
                goal: formData.goal,
              }),
            });
          } catch (err) {
            // Silently fail - local storage is sufficient
            console.log('Backend sync failed, but profile saved locally');
          }
        }
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Heart size={32} />
              <h1 className="text-3xl font-bold">Health Profile</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Tell us about yourself to personalize your experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                min="1"
                max="120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Loader size={18} className="text-blue-600" />
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 70"
                min="1"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Ruler size={18} className="text-blue-600" />
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 175"
                min="1"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Target size={18} className="text-blue-600" />
                Weight Goal *
              </label>
              
              {/* Suggested Goal Display */}
              {bmiResult && getWeightRecommendation() && (
                <div className="mb-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">💡 Suggested Goal</p>
                  <p className="text-lg font-bold text-green-700">{getWeightRecommendation()}</p>
                  <p className="text-xs text-green-600 mt-1">Based on your BMI ({bmiResult.bmi.toFixed(1)})</p>
                </div>
              )}

              {/* Goal Selection */}
              <div className="relative">
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
                {formData.customGoal && (
                  <p className="text-xs text-blue-600 mt-1">✎ You've customized your goal - it's editable anytime</p>
                )}
              </div>
            </div>

            {/* Activity Level - SUGGESTED ONLY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                Your Activity Level
              </label>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Suggested Activity Level:</p>
                <p className="text-lg font-bold text-blue-700 capitalize mb-1">
                  {formData.activityLevel === 'sedentary' && '🏙️ Sedentary'}
                  {formData.activityLevel === 'moderate' && '🚶 Moderate'}
                  {formData.activityLevel === 'active' && '🏃 Active'}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {formData.activityLevel === 'sedentary' && 'Little or no exercise'}
                  {formData.activityLevel === 'moderate' && 'Exercise 3-5 days per week'}
                  {formData.activityLevel === 'active' && 'Exercise 6-7 days per week'}
                </p>
                <input
                  type="hidden"
                  name="activityLevel"
                  value={formData.activityLevel}
                />
              </div>
            </div>

            {/* Medical Conditions Section */}
            <div className="border-t-2 border-blue-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-blue-600" />
                Medical Condition (Optional)
              </h3>

              {/* Blood Pressure Input */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  🩺 Blood Pressure Status
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  placeholder="e.g., Normal/High/Low or 120/80"
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Primary Medical Condition - Searchable Autocomplete */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  📋 Primary Medical Condition
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="medicalCondition"
                    value={formData.medicalCondition}
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
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />

                  {/* Searchable Suggestions Dropdown - Google-like */}
                  {showMedicalSuggestions && (
                    <div className="absolute z-30 w-full mt-1 bg-white border border-blue-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {medicalSuggestions.length > 0 ? (
                        medicalSuggestions.map((condition, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectMedicalCondition(condition)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-blue-100 last:border-b-0 text-sm text-gray-800 font-medium flex items-center gap-3 group"
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

                {/* Selected condition display */}
                {formData.medicalCondition && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Selected:</p>
                    <p className="text-sm font-semibold text-blue-700">✓ {formData.medicalCondition}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BMI Result Display */}
            {bmiResult && (
              <div className={`p-4 rounded-lg border-2 ${
                bmiResult.category === 'Normal Weight' 
                  ? 'border-blue-300 bg-blue-50' 
                  : bmiResult.category === 'Underweight'
                  ? 'border-cyan-300 bg-cyan-50'
                  : 'border-yellow-300 bg-yellow-50'
              }`}>
                <div className="flex items-start gap-3">
                  <TrendingUp size={24} className={
                    bmiResult.category === 'Normal Weight' 
                      ? 'text-blue-600' 
                      : bmiResult.category === 'Underweight'
                      ? 'text-cyan-600'
                      : 'text-yellow-600'
                  } />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      BMI: {bmiResult.bmi} • {bmiResult.category}
                    </h4>
                    <p className="text-sm text-gray-700">{bmiResult.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-8"
            >
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </form>

          {/* Footer Info */}
          <div className="bg-blue-50 px-8 py-6 border-t border-blue-200">
            <p className="text-sm text-gray-600 text-center">
              Your information helps us calculate personalized calorie and nutrient recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessment;
