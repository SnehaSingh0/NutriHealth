import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import {
  hasHealthProfileInStorage,
  persistServerProfileIfPresent,
  HEALTH_PROFILE_STORAGE_KEY,
} from '../utils/dataUtils';
import { getApiUrl } from '../config/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

async function syncHealthProfileFromServerIfMissing(token: string): Promise<void> {
  if (!token || hasHealthProfileInStorage()) return;
  try {
    const res = await fetch(getApiUrl('/api/profile'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const body = await res.json();
    persistServerProfileIfPresent(body.profile as Record<string, unknown> | null | undefined);
  } catch {
    /* offline or server down — keep local state */
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  /** True until persisted auth is read and optional server profile sync has finished (prevents HealthAssessment flash). */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const hydrateSession = async () => {
      const storedUser = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token') || '';

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          await syncHealthProfileFromServerIfMissing(token);
          if (!cancelled) setUser(parsedUser);
        } catch {
          localStorage.removeItem('auth_user');
          if (!cancelled) setUser(null);
        }
      }

      if (!cancelled) setLoading(false);
    };

    void hydrateSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const userData: User = {
        id: data.user_id || data.id,
        email: email,
        createdAt: new Date().toISOString(),
      };

      const token = data.token || '';
      localStorage.setItem('auth_token', token);
      await syncHealthProfileFromServerIfMissing(token);
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      const userData: User = {
        id: data.user_id || data.id,
        email: email,
        createdAt: new Date().toISOString(),
      };

      const token = data.token || '';
      localStorage.setItem('auth_token', token);
      await syncHealthProfileFromServerIfMissing(token);
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem(HEALTH_PROFILE_STORAGE_KEY);
    localStorage.removeItem('has_seen_welcome');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
