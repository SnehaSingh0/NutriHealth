import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import { getTodayDate, getYesterdayDate } from './utils/dateUtils';
import { getDailyData, hasCompletedProfileOnce } from './utils/dataUtils';

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
  const [hasProfile, setHasProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [justSignedIn, setJustSignedIn] = useState(() => {
    // Load from localStorage on initial mount
    return localStorage.getItem('showWelcomePageOnce') === 'true';
  });

  // Verify if we need to handle daily data reset
  useEffect(() => {
    const lastCheckDate = localStorage.getItem('lastCheckDate');
    const today = getTodayDate();

    if (lastCheckDate !== today) {
      // New day - data automatically resets via dateUtils
      localStorage.setItem('lastCheckDate', today);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Check backend for health profile with a timeout
      const checkProfile = async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const localProfile = localStorage.getItem('health_profile');
          
          // PRIORITY 1: If profile exists in localStorage, use it (don't waste time with backend check)
          if (localProfile) {
            setHasProfile(true);
            setJustSignedIn(true);
            localStorage.setItem('showWelcomePageOnce', 'true');
            setCheckingProfile(false);
            return;
          }

          if (!token) {
            // No token and no local profile
            setHasProfile(false);
            setCheckingProfile(false);
            return;
          }

          // Try to fetch from backend with a 5 second timeout (only if no local profile)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          try {
            const response = await fetch('http://localhost:5000/api/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
              const data = await response.json();
              if (data.profile) {
                localStorage.setItem('health_profile', JSON.stringify(data.profile));
                setHasProfile(true);
                setJustSignedIn(true);
                localStorage.setItem('showWelcomePageOnce', 'true');
              } else {
                setHasProfile(false);
              }
            } else {
              setHasProfile(false);
            }
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            setHasProfile(false);
          }
        } catch (err) {
          console.error('Profile check error:', err);
          setHasProfile(false);
        } finally {
          setCheckingProfile(false);
        }
      };

      checkProfile();
    } else {
      setCheckingProfile(false);
    }
  }, [user]);

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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

  if (!hasProfile) {
    return (
      <HealthAssessment onComplete={() => {
        setHasProfile(true);
        setShowWelcome(true); // Show welcome page after form FOR NEW USERS
        setJustSignedIn(false);
      }} />
    );
  }

  // Show welcome page for BOTH new users and returning users on first sign in
  if (showWelcome || justSignedIn) {
    return (
      <HealthWelcome onContinue={() => {
        setShowWelcome(false);
        setJustSignedIn(false); // Mark that we've shown welcome page
        localStorage.setItem('showWelcomePageOnce', 'false'); // Clear the flag
        setCurrentPage('dashboard');
      }} />
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        active={currentPage} 
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 ml-0 lg:ml-56 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}
