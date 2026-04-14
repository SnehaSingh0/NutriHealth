import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Upload,
  ClipboardList,
  Dumbbell,
  History,
  Salad,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate, isOpen = true, onToggle }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Food', icon: Upload },
    { id: 'tracker', label: 'Manual Tracker', icon: ClipboardList },
    { id: 'exercise', label: 'Exercise Plan', icon: Dumbbell },
    { id: 'history', label: 'Food History', icon: History },
    { id: 'diet', label: 'Personalized Diet', icon: Salad },
    { id: 'profile', label: 'Health Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile / small tablet: menu toggle; hidden from md up (fixed sidebar) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Dim overlay when drawer is open (mobile / small screens only) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
          aria-hidden
        />
      )}

      {/* Sidebar: off-canvas below md; fixed + always visible md+ */}
      <aside
        className={`
        bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col h-screen fixed left-0 top-0 z-40
        w-56 shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-56 md:fixed md:left-0 md:top-0 md:translate-x-0
      `}
      >
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">NH</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">NutriHealth</h1>
            <p className="text-xs text-blue-200">Your Health, Personalized</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onToggle?.(); // Close sidebar on mobile after nav
              }}
              className={`w-full px-4 md:px-6 py-3 flex items-center gap-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-blue-600 border-r-4 border-white'
                  : 'text-blue-100 hover:bg-blue-500/50'
              }`}
            >
              <Icon size={20} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 justify-center font-medium text-sm transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
