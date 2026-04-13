import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigation handled by App.tsx
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      {/* Left Section - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">NutriHealth</h2>
            <p className="text-xl text-blue-100">AI-based Nutrition and Health Prediction System</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Smart Food Tracking</h3>
                <p className="text-blue-100">Log meals easily with AI-powered food analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Personalized Insights</h3>
                <p className="text-blue-100">
                  Get AI-generated diet recommendations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ArrowRight className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Health Tracking</h3>
                <p className="text-blue-100">Monitor nutrition and predict your wellness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Continue to your nutrition dashboard
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Lock size={18} className="text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all mt-6 sm:mt-7 flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <button
              onClick={onToggle}
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors"
            >
              Create Account
            </button>

            {/* Security Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Encrypted & Secure • 100% Privacy Protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
