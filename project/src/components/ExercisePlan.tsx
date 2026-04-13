import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Dumbbell, Plus, X, TrendingUp, Search } from 'lucide-react';
import {
  getExercises,
  searchExercises,
  calculateCaloriesBurned,
  getExerciseByName,
} from '../data/exerciseDatabase';

interface FormData {
  exerciseName: string;
  hours: number;
  minutes: number;
  seconds: number;
  caloriesBurned: string;
}

const ExercisePlan: React.FC = () => {
  const { addExercise, removeExercise, todayData } = useData();
  const [formData, setFormData] = useState<FormData>({
    exerciseName: '',
    hours: 0,
    minutes: 30,
    seconds: 0,
    caloriesBurned: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<ReturnType<typeof getExercises>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [autoCalcEnabled, setAutoCalcEnabled] = useState(true);
  const [userWeight, setUserWeight] = useState(70);

  useEffect(() => {
    try {
      const profile = localStorage.getItem('health_profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        if (parsed.weight) {
          setUserWeight(parsed.weight);
        }
      }
    } catch (e) {
      console.log('Could not load health profile');
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = searchExercises(query);
      setFilteredExercises(filtered);
      setShowDropdown(true);
    } else {
      setFilteredExercises([]);
      setShowDropdown(false);
    }
  };

  const handleSelectExercise = (exercise: ReturnType<typeof getExercises>[0]) => {
    setFormData(prev => ({
      ...prev,
      exerciseName: exercise.name,
    }));
    setSearchQuery(exercise.name);
    setShowDropdown(false);

    // Auto-calculate calories
    if (autoCalcEnabled && (formData.hours > 0 || formData.minutes > 0 || formData.seconds > 0)) {
      const calories = calculateCaloriesBurned(
        exercise.name,
        formData.hours,
        formData.minutes,
        formData.seconds,
        userWeight
      );
      setFormData(prev => ({
        ...prev,
        caloriesBurned: calories.toString(),
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numValue = name !== 'exerciseName' ? Math.max(0, parseInt(value) || 0) : value;

    setFormData(prev => ({
      ...prev,
      [name]: numValue,
    }));

    // Auto-calculate on duration change
    if (['hours', 'minutes', 'seconds'].includes(name) && autoCalcEnabled && formData.exerciseName) {
      const exercise = getExercises().find(
        e => e.name.toLowerCase() === formData.exerciseName.toLowerCase()
      );
      if (exercise) {
        const h = Number(name === 'hours' ? numValue : formData.hours);
        const m = Number(name === 'minutes' ? numValue : formData.minutes);
        const s = Number(name === 'seconds' ? numValue : formData.seconds);

        if (h > 0 || m > 0 || s > 0) {
          const calories = calculateCaloriesBurned(
            formData.exerciseName,
            h,
            m,
            s,
            userWeight
          );
          setFormData(prev => ({
            ...prev,
            caloriesBurned: calories.toString(),
          }));
        }
      }
    }
  };

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateForm = () => {
    if (!formData.exerciseName.trim()) {
      setError('Exercise name is required');
      return false;
    }
    if (formData.hours === 0 && formData.minutes === 0 && formData.seconds === 0) {
      setError('Duration required (hours, minutes, or seconds)');
      return false;
    }
    if (!formData.caloriesBurned || parseFloat(formData.caloriesBurned) < 0) {
      setError('Valid calorie burn amount is required');
      return false;
    }
    return true;
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const totalDurationText = `${formData.hours}h ${formData.minutes}m ${formData.seconds}s`.replace(
      /\b0[a-z]\s*/g,
      ''
    );

    const newExercise = {
      id: generateId(),
      name: formData.exerciseName.trim(),
      duration: formData.hours * 3600 + formData.minutes * 60 + formData.seconds, // total in seconds
      caloriesBurned: parseFloat(formData.caloriesBurned),
      time: new Date().getTime(),
      timestamp: new Date().toISOString(),
    };

    addExercise(newExercise);
    setSuccess(`${formData.exerciseName} (${totalDurationText}) logged successfully!`);
    setFormData({
      exerciseName: '',
      hours: 0,
      minutes: 30,
      seconds: 0,
      caloriesBurned: '',
    });
    setSearchQuery('');

    setTimeout(() => setSuccess(''), 3000);
  };

  const quickAddExercises = [
    { name: 'Running', hours: 0, minutes: 30, seconds: 0 },
    { name: 'Walking', hours: 1, minutes: 0, seconds: 0 },
    { name: 'Yoga', hours: 1, minutes: 0, seconds: 0 },
    { name: 'Meditation', hours: 0, minutes: 20, seconds: 0 },
    { name: 'Cycling', hours: 0, minutes: 45, seconds: 0 },
    { name: 'Swimming', hours: 0, minutes: 30, seconds: 0 },
  ];

  const addQuickExercise = (exercise: typeof quickAddExercises[0]) => {
    const exercise_entry = getExercises().find(
      e => e.name.toLowerCase() === exercise.name.toLowerCase()
    );
    if (!exercise_entry) return;

    const calories = calculateCaloriesBurned(
      exercise.name,
      exercise.hours,
      exercise.minutes,
      exercise.seconds,
      userWeight
    );

    const newExercise = {
      id: generateId(),
      name: exercise.name,
      duration: exercise.hours * 3600 + exercise.minutes * 60 + exercise.seconds,
      caloriesBurned: calories,
      time: new Date().getTime(),
      timestamp: new Date().toISOString(),
    };

    addExercise(newExercise);
    setSuccess(`${exercise.name} added successfully! 🔥 ${calories} cal burned`);

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">Workout Tracker</h2>
              <p className="text-purple-200 text-sm">Track your exercises and burn calories</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg px-4 py-2 text-purple-100 text-sm">
                🔥 {todayData.exerciseLogs.length} workouts today
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg px-4 py-2 text-purple-100 text-sm">
                ⚡ {todayData.caloriesBurned} cal burned
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-20 backdrop-blur-md border border-red-400 rounded-lg text-red-200 text-sm animate-pulse">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500 bg-opacity-20 backdrop-blur-md border border-green-400 rounded-lg text-green-200 text-sm animate-bounce">
            ✅ {success}
          </div>
        )}

        {/* Quick Add Buttons - Enhanced */}
        <div className="mb-8">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-pink-400" />
            Quick Add Workouts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickAddExercises.map((ex) => (
              <button
                key={ex.name}
                onClick={() => addQuickExercise(ex)}
                className="group relative px-4 py-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:-translate-y-1 transform"
              >
                <span className="text-lg">⚡</span>
                <span className="block text-xs mt-1">{ex.name}</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white bg-opacity-20 rounded-lg transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleAddExercise} className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <Dumbbell className="w-6 h-6 text-pink-400" />
                Log New Exercise
              </h3>

              {/* Exercise Search */}
              <div className="relative">
                <label className="block text-sm font-semibold text-purple-200 mb-3">
                  Select Exercise <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-purple-300" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                    className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>

                {showDropdown && filteredExercises.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-purple-500 rounded-lg shadow-2xl z-10 max-h-48 overflow-y-auto">
                    {filteredExercises.map((exercise, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectExercise(exercise)}
                        className="w-full text-left px-4 py-3 hover:bg-purple-600 hover:bg-opacity-50 border-b border-purple-500 last:border-b-0 text-sm transition-colors"
                      >
                        <div className="font-semibold text-white">{exercise.name}</div>
                        <div className="text-xs text-purple-300">MET: {exercise.metValue}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Duration Fields */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-purple-200">
                  Duration <span className="text-pink-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      name="hours"
                      min="0"
                      max="23"
                      value={formData.hours}
                      onChange={handleInputChange}
                      placeholder="Hours"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                    <p className="text-xs text-purple-300 mt-1 text-center">Hours</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="minutes"
                      min="0"
                      max="59"
                      value={formData.minutes}
                      onChange={handleInputChange}
                      placeholder="Minutes"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                    <p className="text-xs text-purple-300 mt-1 text-center">Minutes</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="seconds"
                      min="0"
                      max="59"
                      value={formData.seconds}
                      onChange={handleInputChange}
                      placeholder="Seconds"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                    <p className="text-xs text-purple-300 mt-1 text-center">Seconds</p>
                  </div>
                </div>
              </div>

              {/* Calories Burned */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-purple-200">
                    Calories Burned <span className="text-pink-400">*</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={autoCalcEnabled}
                      onChange={(e) => setAutoCalcEnabled(e.target.checked)}
                      className="w-4 h-4 rounded bg-white bg-opacity-20 border border-white border-opacity-30 cursor-pointer accent-pink-500"
                    />
                    <span className="text-purple-300 group-hover:text-purple-100 transition-colors">Auto-calculate</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="caloriesBurned"
                    min="0"
                    step="1"
                    value={formData.caloriesBurned}
                    onChange={handleInputChange}
                    placeholder="Calories"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                  {formData.caloriesBurned && (
                    <div className="absolute right-4 top-3.5 text-pink-400 font-semibold">
                      🔥 {Math.round(parseFloat(formData.caloriesBurned))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full group relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:-translate-y-0.5 transform flex items-center justify-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <Plus className="w-6 h-6" />
                <span>Log Workout</span>
              </button>
            </form>
          </div>

          {/* Today's Exercises List */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-pink-400" />
                Today's Stats
              </h3>

              {todayData.exerciseLogs.length > 0 ? (
                <div className="space-y-4">
                  {/* Total Workouts */}
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Total Workouts</p>
                    <p className="text-3xl font-bold">{todayData.exerciseLogs.length}</p>
                  </div>

                  {/* Total Calories Burned */}
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Calories Burned</p>
                    <p className="text-3xl font-bold">🔥 {Math.round(todayData.caloriesBurned)}</p>
                  </div>

                  {/* Exercise List */}
                  <div className="space-y-2 mt-6">
                    <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Recent Activities</p>
                    {todayData.exerciseLogs.slice(-5).reverse().map((exercise, idx) => (
                      <div
                        key={exercise.id}
                        className="group bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 hover:border-pink-500 hover:border-opacity-50 rounded-lg p-3 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{exercise.name}</p>
                            <p className="text-purple-300 text-xs mt-1">{formatDuration(exercise.duration)}</p>
                          </div>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-red-400 hover:text-red-300" />
                          </button>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white border-opacity-10">
                          <p className="text-pink-400 text-sm font-bold">{exercise.caloriesBurned} cal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 text-purple-300 mx-auto mb-3 opacity-50" />
                  <p className="text-purple-300">No workouts yet</p>
                  <p className="text-purple-400 text-xs mt-1">Start by logging an exercise!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDuration(seconds: number): string {
  if (typeof seconds !== 'number') return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.length > 0 ? parts.join(' ') : '0m';
}

export default ExercisePlan;
