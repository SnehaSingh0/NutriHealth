import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { getProfile } from '../utils/dataUtils';
import { predictWeightChange } from '../utils/nutritionUtils';
import { Camera, Upload, X, CheckCircle, AlertCircle, Search, Edit2, Check, Zap, ImageOff } from 'lucide-react';
import { getFoodNutrition, searchFoods } from '../data/foodDatabase';

const UNIT_SUGGESTIONS: { [key: string]: string[] } = {
  'pizza': ['Slice', 'Small', 'Medium', 'Large', 'Half', 'Whole'],
  'burger': ['Small', 'Medium', 'Large', 'Double', 'Piece'],
  'chapati': ['Small', 'Medium', 'Large', 'Piece'],
  'roti': ['Small', 'Medium', 'Large', 'Piece'],
  'naan': ['Small', 'Medium', 'Large', 'Piece'],
  'rice': ['Small Bowl', 'Medium Bowl', 'Large Bowl', 'Cup'],
  'biryani': ['Small bowl', 'Medium bowl', 'Large bowl', 'Serving'],
  'dal': ['Small bowl', 'Medium bowl', 'Large bowl', 'Cup'],
  'curry': ['Small bowl', 'Medium bowl', 'Large bowl', 'Cup'],
  'paneer': ['Small piece', 'Medium piece', 'Large piece', '100g'],
  'salad': ['Small bowl', 'Medium bowl', 'Large bowl', 'Plate'],
  'soup': ['Small bowl', 'Medium bowl', 'Large bowl', 'Cup'],
  'ice cream': ['Small', 'Medium', 'Large', 'Scoop'],
  'cake': ['Small slice', 'Medium slice', 'Large slice'],
  'chocolate': ['Small', 'Medium', 'Large', 'Bar'],
  'fries': ['Small', 'Medium', 'Large', 'Cup'],
  'chicken': ['Small piece', 'Medium piece', 'Large piece', '100g'],
  'apple': ['Small', 'Medium', 'Large'],
  'banana': ['Small', 'Medium', 'Large'],
  'default': ['Small', 'Medium', 'Large'],
};

const UploadFood: React.FC = () => {
  const { todayData, addFood, removeFood } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDetectedFood, setAiDetectedFood] = useState<string>('');
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  const [foodName, setFoodName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('Medium');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unitOptions, setUnitOptions] = useState<string[]>(UNIT_SUGGESTIONS['default']);

  const [nutritionPreview, setNutritionPreview] = useState<any>(null);
  const [weightPrediction, setWeightPrediction] = useState<any>(null);
  const [healthAffect, setHealthAffect] = useState<string>('');

  const [showNutrition, setShowNutrition] = useState(false);
  const [isEditingFood, setIsEditingFood] = useState(false);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [cameraSupported, setCameraSupported] = useState(true);
  const [recognitionFailed, setRecognitionFailed] = useState(false);
  const [cameraClickedFailed, setCameraClickedFailed] = useState(false);

  const userProfile = getProfile();

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach(track => track.stop());
      setCameraSupported(true);
      setCameraClickedFailed(false);
      cameraInputRef.current?.click();
    } catch (err) {
      setCameraSupported(false);
      setCameraClickedFailed(true);
    }
  };

  const handleImageFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setUploadedFileName(file.name);
      setError('');
      simulateAIDetection(file.name);
    };
    reader.readAsDataURL(file);
  };

  const simulateAIDetection = (fileName: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const detected = detectFoodFromFileName(fileName);
      if (detected) {
        setRecognitionFailed(false);
        setAiDetectedFood(detected);
        setAiConfidence(Math.floor(Math.random() * 20) + 80);
        setFoodName(detected);
        handleFoodSelection(detected);
      } else {
        setRecognitionFailed(true);
        setAiDetectedFood('');
        setAiConfidence(null);
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const detectFoodFromFileName = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    const foodKeywords: { [key: string]: string } = {
      'chapati': 'Chapati', 'roti': 'Roti', 'naan': 'Naan', 'rice': 'Rice',
      'biryani': 'Biryani', 'dal': 'Dal', 'curry': 'Chicken Curry',
      'paneer': 'Paneer', 'apple': 'Apple', 'banana': 'Banana',
      'pizza': 'Pizza', 'burger': 'Burger', 'salad': 'Salad',
      'soup': 'Soup', 'smoothie': 'Smoothie',
    };
    for (const [keyword, food] of Object.entries(foodKeywords)) {
      if (lowerName.includes(keyword)) return food;
    }
    return '';
  };

  const handleFoodNameChange = (value: string) => {
    setFoodName(value);
    if (value.trim()) {
      const results = searchFoods(value);
      setSuggestions(results.slice(0, 8).map(f => f.name));
      setShowSuggestions(true);
      const lowerFood = value.toLowerCase();
      let units = UNIT_SUGGESTIONS['default'];
      for (const [key, unitList] of Object.entries(UNIT_SUGGESTIONS)) {
        if (key !== 'default' && lowerFood.includes(key)) {
          units = unitList;
          break;
        }
      }
      setUnitOptions(units);
      setUnit(units[0]);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setUnitOptions(UNIT_SUGGESTIONS['default']);
      setUnit('Medium');
    }
  };

  const handleFoodSelection = (selectedFood: string) => {
    setFoodName(selectedFood);
    setSuggestions([]);
    setShowSuggestions(false);
    const lowerFood = selectedFood.toLowerCase();
    let units = UNIT_SUGGESTIONS['default'];
    for (const [key, unitList] of Object.entries(UNIT_SUGGESTIONS)) {
      if (key !== 'default' && lowerFood.includes(key)) {
        units = unitList;
        break;
      }
    }
    setUnitOptions(units);
    setUnit(units[0]);
    setError('');
  };

  useEffect(() => {
    if (quantity && nutritionPreview) {
      const qty = parseFloat(quantity) || 0;
      const scaledNutrition = {
        calories: Math.round(nutritionPreview.calories * qty),
        protein: nutritionPreview.protein * qty,
        carbs: nutritionPreview.carbs * qty,
        fats: nutritionPreview.fats * qty,
      };
      setNutritionPreview(scaledNutrition);
      updateWeightPrediction(scaledNutrition.calories);
    }
  }, [quantity]);

  const updateWeightPrediction = (calories: number) => {
    if (userProfile?.currentWeight) {
      const totalConsumedCalories = todayData.foodLogs.reduce((sum, food) => sum + food.calories, 0) + calories;
      const prediction = predictWeightChange(
        userProfile.currentWeight,
        userProfile.dailyCalorieGoal || 2000,
        totalConsumedCalories,
        7,
        todayData.caloriesBurned
      );
      setWeightPrediction(prediction);
    }
  };

  const handleCheckNutrition = () => {
    if (!foodName.trim()) {
      setError('📸 Please select a food first');
      return;
    }
    if (!quantity) {
      setError('📍 Enter quantity');
      return;
    }
    const qty = parseFloat(quantity) || 1;
    const nutrition = getFoodNutrition(foodName, qty, 'grams');
    if (nutrition && nutrition.calories > 0) {
      setNutritionPreview(nutrition);
      setError('');
      setShowNutrition(true);
      const affect = nutrition.calories > 800 ? '🔴 Heavy meal' : nutrition.calories > 500 ? '🟡 Regular' : '🟢 Light';
      setHealthAffect(affect);
      if (userProfile?.currentWeight) {
        const totalConsumedCalories = todayData.foodLogs.reduce((sum, food) => sum + food.calories, 0) + nutrition.calories;
        const prediction = predictWeightChange(
          userProfile.currentWeight,
          userProfile.dailyCalorieGoal || 2000,
          totalConsumedCalories,
          7,
          todayData.caloriesBurned
        );
        setWeightPrediction(prediction);
      }
    } else {
      setError(`❌ Couldn't find "${foodName}". Enter manually.`);
      setNutritionPreview(null);
    }
  };

  const handleLogFood = () => {
    if (!foodName.trim() || !nutritionPreview) {
      setError('Check nutrition first');
      return;
    }
    const food = {
      id: Date.now().toString(),
      name: foodName,
      quantity: parseFloat(quantity) || 1,
      unit: unit,
      calories: nutritionPreview.calories,
      protein: nutritionPreview.protein,
      carbs: nutritionPreview.carbs,
      fats: nutritionPreview.fats,
      time: new Date().getTime(),
      timestamp: new Date().toISOString(),
    };
    addFood(food);
    setSuccess(`✅ ${foodName} logged!`);
    setTimeout(() => {
      setFoodName('');
      setQuantity('');
      setUnit('Medium');
      setImagePreview(null);
      setAiDetectedFood('');
      setAiConfidence(null);
      setNutritionPreview(null);
      setShowNutrition(false);
      setIsEditingFood(false);
      setSuccess('');
    }, 2000);
  };

  const totalNutrition = {
    calories: todayData.foodLogs.reduce((sum, food) => sum + food.calories, 0),
    protein: todayData.foodLogs.reduce((sum, food) => sum + food.protein, 0),
    carbs: todayData.foodLogs.reduce((sum, food) => sum + food.carbs, 0),
    fats: todayData.foodLogs.reduce((sum, food) => sum + food.fats, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-3 sm:py-6 sm:px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl">
          <h1 className="text-3xl sm:text-5xl font-black mb-2 sm:mb-3">🍽️ Nutrition Intelligence</h1>
          <p className="text-blue-100 font-semibold text-sm sm:text-lg">Scan & track meals with AI-powered insights</p>
        </div>

        {/* TOP SECTION: Upload + Daily Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Upload Controls */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-7 border-3 border-cyan-200">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4 sm:mb-5">📸 Capture Meal</h2>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={handleCameraClick}
                  className="w-full p-3 sm:p-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl sm:rounded-2xl text-white font-bold text-base sm:text-lg shadow-lg"
                >
                  📷 Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 sm:p-4 bg-gradient-to-r from-emerald-100 to-teal-100 border-3 border-emerald-400 rounded-xl sm:rounded-2xl font-bold text-gray-900 shadow-md text-base sm:text-lg"
                >
                  📁 Upload Photo
                </button>
              </div>
              {cameraClickedFailed && !cameraSupported && (
                <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 rounded-2xl text-sm text-amber-900">
                  <p className="font-bold">📱 No Camera Available</p>
                  <p className="text-xs mt-1">Use Upload button instead</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} className="hidden" />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} className="hidden" />
            </div>
          </div>

          {/* Daily Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 border-3 border-blue-300">
              <h3 className="text-xs sm:text-sm font-black text-blue-900 mb-3 sm:mb-4 uppercase">📊 Daily Calories</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl sm:text-4xl font-black text-blue-900">{totalNutrition.calories}</span>
                <span className="text-xs sm:text-sm font-bold text-blue-700">/ {userProfile?.dailyCalorieGoal || 2000}</span>
              </div>
              <div className="w-full bg-blue-300 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${Math.min((totalNutrition.calories / (userProfile?.dailyCalorieGoal || 2000)) * 100, 100)}%` }} />
              </div>
            </div>

            {weightPrediction && userProfile?.currentWeight && (
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl shadow-lg p-6 border-3 border-indigo-300">
                <h3 className="text-sm font-black text-indigo-900 mb-4 uppercase">⚡ Weight Forecast</h3>
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl text-center border-3 font-bold text-lg ${
                    weightPrediction.predictedWeightIn7Days < userProfile.currentWeight 
                      ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-400 text-emerald-900'
                      : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-400 text-rose-900'
                  }`}>
                    <p className="text-xs font-black mb-1">IN 7 DAYS</p>
                    <p className="text-3xl font-black">{weightPrediction.predictedWeightIn7Days}kg</p>
                  </div>
                  <div className={`p-4 rounded-2xl text-center border-3 font-bold text-lg ${
                    weightPrediction.predictedWeightIn30Days < userProfile.currentWeight 
                      ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-400 text-emerald-900'
                      : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-400 text-rose-900'
                  }`}>
                    <p className="text-xs font-black mb-1">IN 30 DAYS</p>
                    <p className="text-3xl font-black">{weightPrediction.predictedWeightIn30Days}kg</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-lg p-8 border-3 border-emerald-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">📷 Your Meal Photo</h2>
              <button onClick={() => { setImagePreview(null); setAiDetectedFood(''); setAiConfidence(null); setRecognitionFailed(false); }} className="p-3 bg-red-100 hover:bg-red-200 rounded-xl text-red-600 shadow-md">
                <X size={24} />
              </button>
            </div>
            <img src={imagePreview} alt="Meal" className="w-48 h-48 object-cover rounded-2xl shadow-xl mb-6 mx-auto border-4 border-emerald-200" />
            
            {isAnalyzing && (
              <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border-3 border-blue-300 text-center mb-6">
                <span className="text-sm font-bold text-blue-900">🤖 Analyzing...</span>
              </div>
            )}
            
            {recognitionFailed && !isAnalyzing && (
              <div className="p-5 bg-gradient-to-r from-orange-100 to-red-100 border-3 border-orange-300 rounded-2xl mb-6">
                <p className="font-bold text-orange-900">⚠️ Couldn't recognize this meal</p>
                <p className="text-xs text-orange-800 mt-1">Type food name below</p>
              </div>
            )}
          </div>
        )}

        {/* Two Square Blocks */}
        <div className="hidden">hidden</div>

        {/* AI Detection Box */}
        {/* Compact AI Detection Bar */}
        {imagePreview && aiDetectedFood && aiConfidence !== null && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-300 p-5 mb-6 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-bold text-indigo-600 mb-2">AI Detected: <span className="text-lg text-indigo-900">{foodName}</span></p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${aiConfidence}%` }}
                />
              </div>
              <p className="text-xs text-indigo-700 mt-1">{aiConfidence}% confidence</p>
            </div>
            <button
              onClick={() => setIsEditingFood(true)}
              className="ml-4 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold text-sm"
            >
              Edit
            </button>
          </div>
        )}

        {/* Food Details Form */}
        <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl shadow-lg p-8 border-3 border-rose-300 mb-8"
        >
            <h3 className="font-black text-gray-900 text-2xl mb-6">📝 Food Details</h3>
            
            <div className="mb-6">
              <label className="text-sm font-black text-gray-700 mb-3 block uppercase">Food Name {!imagePreview && '*'}</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-rose-400" />
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => handleFoodNameChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Type food name..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-rose-300 rounded-xl text-sm focus:outline-none focus:border-rose-500 font-semibold"
                />
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-rose-300 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleFoodSelection(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-rose-100 border-b border-rose-100 last:border-0 text-sm font-semibold"
                      >
                        🍽️ {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {foodName && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-black text-gray-700 mb-2 block uppercase">Quantity *</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      step="0.1"
                      min="0"
                      placeholder="1"
                      className="flex-1 px-4 py-3 border-2 border-rose-300 rounded-xl font-semibold focus:outline-none focus:border-rose-500"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="px-4 py-3 border-2 border-rose-300 rounded-xl font-semibold"
                    >
                      {unitOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((val) => (
                    <button
                      key={val}
                      onClick={() => setQuantity(val.toString())}
                      className={`py-3 px-3 rounded-xl font-bold text-sm border-2 ${
                        quantity === val.toString() 
                          ? 'bg-gradient-to-r from-rose-500 to-orange-600 text-white border-rose-600 shadow-lg'
                          : 'bg-white text-gray-900 border-rose-300 hover:border-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      {val}x
                    </button>
                  ))}
                </div>


              </div>
            )}
        </div>

        {/* Log Food + Preview Buttons Side by Side */}
        {foodName && quantity && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleLogFood}
              disabled={!nutritionPreview}
              className="flex-1 py-4 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              ✓ Log Food
            </button>
            <button
              onClick={handleCheckNutrition}
              disabled={!quantity}
              className="flex-1 py-4 px-4 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 disabled:opacity-50 font-bold rounded-2xl transition-all"
            >
              👁️ Preview
            </button>
          </div>
        )}

        {/* Preview: Nutrition Summary with Health Affect and Weight Prediction */}
        {showNutrition && nutritionPreview && (
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl shadow-lg p-8 border-3 border-cyan-300 mb-8">
            <h3 className="font-black text-gray-900 text-2xl mb-6">💪 Nutrition & Impact Preview</h3>
            
            {/* Nutrition Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl text-center border-2 border-red-300">
                <p className="text-xs font-black text-red-900 mb-2 uppercase">Calories</p>
                <p className="text-4xl font-black text-red-900">{nutritionPreview.calories}</p>
                <p className="text-xs text-red-800 mt-2 font-bold">kcal</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-6 rounded-2xl text-center border-2 border-yellow-300">
                <p className="text-xs font-black text-amber-900 mb-2 uppercase">Protein</p>
                <p className="text-4xl font-black text-amber-900">{nutritionPreview.protein.toFixed(1)}</p>
                <p className="text-xs text-amber-800 mt-2 font-bold">g</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-2xl text-center border-2 border-purple-300">
                <p className="text-xs font-black text-indigo-900 mb-2 uppercase">Carbs</p>
                <p className="text-4xl font-black text-indigo-900">{nutritionPreview.carbs.toFixed(1)}</p>
                <p className="text-xs text-indigo-800 mt-2 font-bold">g</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl text-center border-2 border-orange-300">
                <p className="text-xs font-black text-orange-900 mb-2 uppercase">Fats</p>
                <p className="text-4xl font-black text-orange-900">{nutritionPreview.fats.toFixed(1)}</p>
                <p className="text-xs text-orange-800 mt-2 font-bold">g</p>
              </div>
            </div>

            {/* Health Affect */}
            {healthAffect && (
              <div className="mb-6 p-5 bg-white border-2 border-cyan-300 rounded-2xl">
                <p className="text-lg font-black text-gray-900">Impact on Body: {healthAffect}</p>
              </div>
            )}

            {/* Weight Prediction */}
            {weightPrediction && userProfile?.currentWeight && (
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl text-center border-3 font-bold ${
                  weightPrediction.predictedWeightIn7Days < userProfile.currentWeight 
                    ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-400 text-emerald-900'
                    : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-400 text-rose-900'
                }`}>
                  <p className="text-xs font-black mb-2">IN 7 DAYS</p>
                  <p className="text-3xl font-black">{weightPrediction.predictedWeightIn7Days}kg</p>
                  <p className="text-xs mt-1">Current: {userProfile.currentWeight}kg</p>
                </div>
                <div className={`p-5 rounded-2xl text-center border-3 font-bold ${
                  weightPrediction.predictedWeightIn30Days < userProfile.currentWeight 
                    ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-400 text-emerald-900'
                    : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-400 text-rose-900'
                }`}>
                  <p className="text-xs font-black mb-2">IN 30 DAYS</p>
                  <p className="text-3xl font-black">{weightPrediction.predictedWeightIn30Days}kg</p>
                  <p className="text-xs mt-1">Current: {userProfile.currentWeight}kg</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-100 to-orange-100 border-3 border-red-300 rounded-2xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <p className="text-red-800 text-sm font-semibold">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-100 to-green-100 border-3 border-emerald-300 rounded-2xl flex items-start gap-4 shadow-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <p className="text-emerald-800 text-sm font-bold">{success}</p>
          </div>
        )}

        {/* Today's Macros */}
        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl shadow-lg p-8 border-3 border-orange-300 mb-8">
          <h3 className="text-2xl font-black text-orange-900 mb-6">🥗 Today's Macros</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl text-center border-3 border-red-300 shadow-lg">
              <p className="text-xs font-black text-red-900 mb-2 uppercase">Protein</p>
              <p className="text-5xl font-black text-red-900">{totalNutrition.protein.toFixed(0)}</p>
              <p className="text-sm text-red-800 mt-2 font-bold">g</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-6 rounded-2xl text-center border-3 border-yellow-300 shadow-lg">
              <p className="text-xs font-black text-amber-900 mb-2 uppercase">Carbs</p>
              <p className="text-5xl font-black text-amber-900">{totalNutrition.carbs.toFixed(0)}</p>
              <p className="text-sm text-amber-800 mt-2 font-bold">g</p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl text-center border-3 border-orange-300 shadow-lg">
              <p className="text-xs font-black text-orange-900 mb-2 uppercase">Fats</p>
              <p className="text-5xl font-black text-orange-900">{totalNutrition.fats.toFixed(0)}</p>
              <p className="text-sm text-orange-800 mt-2 font-bold">g</p>
            </div>
          </div>
        </div>

        {/* Today's Food Log */}
        {todayData.foodLogs.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg border-3 border-green-300">
            <div className="p-7 border-b-3 border-green-300 bg-gradient-to-r from-green-100 to-emerald-100">
              <h3 className="text-2xl font-black text-green-900">🍽️ Today's Meals ({todayData.foodLogs.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y-2 divide-green-300">
              {todayData.foodLogs.map((food) => (
                <div key={food.id} className="p-5 hover:bg-green-100 transition flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-lg text-green-900">{food.name}</p>
                    <p className="text-sm text-green-700 font-semibold">{food.quantity} {food.unit} • {food.calories} cal • {food.protein.toFixed(1)}g protein</p>
                  </div>
                  <button onClick={() => removeFood(food.id)} className="text-green-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition bg-red-100 hover:bg-red-200 rounded-lg p-2 shadow-md">
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFood;
