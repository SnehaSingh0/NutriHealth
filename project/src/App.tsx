import React, { useState, useEffect, useReducer } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getTodayDate } from './utils/dateUtils';
import { hasHealthProfileInStorage, hasSeenHealthWelcomeInStorage } from './utils/dataUtils';

import Login from './components/Login';
import Register from './components/Register';
import HealthAssessment from './components/HealthAssessment';
import HealthWelcome from './components/HealthWelcome';
import Sidebar from './components/Sidebar';

import Dashboard from './components/Dashboard';
import FoodHistory from './components/FoodHistory';
import ManualTracker from './components/ManualTracker';
import UploadFood from './components/UploadFood';
import ExercisePlan from './components/ExercisePlan';
import PersonalizedDiet from './components/PersonalizedDiet';
import HealthProfile from './components/HealthProfile';

export default function App() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [, bumpFlow] = useReducer((n: number) => n + 1, 0);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  // Verify if we need to handle daily data reset
  useEffect(() => {
    const lastCheckDate = localStorage.getItem('lastCheckDate');
    const today = getTodayDate();

    if (lastCheckDate !== today) {
      // New day - data automatically resets via dateUtils
      localStorage.setItem('lastCheckDate', today);
    }
  }, []);

  // `loading` stays true until session hydrate + optional GET /api/profile sync finish (see AuthProvider).
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center px-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-medium">Loading your account</p>
          <p className="text-gray-500 text-sm mt-1">Syncing profile if needed…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {showLogin ? (
          <Login onToggle={() => setShowLogin(false)} />
        ) : (
          <Register onToggle={() => setShowLogin(true)} />
        )}
      </>
    );
  }

  const hasProfile = hasHealthProfileInStorage();
  const hasSeenWelcome = hasSeenHealthWelcomeInStorage();

  if (!hasProfile) {
    return <HealthAssessment onComplete={() => bumpFlow()} />;
  }

  if (!hasSeenWelcome) {
    return (
      <HealthWelcome
        onContinue={() => {
          setCurrentPage('dashboard');
          bumpFlow();
        }}
      />
    );
  }

  // Map page to components
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadFood />;
      case 'tracker':
        return <ManualTracker />;
      case 'exercise':
        return <ExercisePlan />;
      case 'history':
        return <FoodHistory />;
      case 'diet':
        return <PersonalizedDiet />;
      case 'profile':
        return <HealthProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen min-h-0 w-full max-w-full overflow-hidden bg-gray-100">
      <Sidebar 
        active={currentPage} 
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 min-w-0 w-full ml-0 md:ml-56 overflow-auto pt-16 md:pt-0">
        {renderPage()}
      </main>
    </div>
  );
}
