import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (creds: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  toggleSaveDestination: (id: string) => Promise<void>;
  savedIds: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sns_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sns_token'));
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      authService.getMe()
        .then(u => {
          setUser(u);
          if (u.savedDestinations) {
            setSavedIds(u.savedDestinations.map((d: any) => typeof d === 'string' ? d : d._id));
          }
        })
        .catch(() => logout());
    }
  }, [token]);

  const login = async (creds: { email: string; password: string }) => {
    const res = await authService.login(creds);
    setUser(res.user);
    setToken(res.token);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await authService.register(data);
    setUser(res.user);
    setToken(res.token);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setSavedIds([]);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const u = await authService.getMe();
      setUser(u);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSaveDestination = async (destId: string) => {
    if (!isAuthenticated) return;
    try {
      const updated = await authService.toggleSaveDestination(destId);
      setSavedIds(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = !!user && (user.role === 'super_admin' || user.role === 'admin' || user.role === 'booking_manager');

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      refreshUser,
      toggleSaveDestination,
      savedIds
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
