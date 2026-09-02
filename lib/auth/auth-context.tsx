'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (name: string, password?: string) => { success: boolean; error?: string };
  register: (role: UserRole, name: string, password?: string, id?: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => ({ success: false, error: 'Not initialized' }),
  register: () => ({ success: false, error: 'Not initialized' }),
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Session restore on mount
    const storedSession = localStorage.getItem('quiz-app-session');
    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch {
        localStorage.removeItem('quiz-app-session');
      }
    }
  }, []);

  const getUsersDb = (): User[] => {
    try {
      const db = localStorage.getItem('quiz-app-users-db');
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  const saveUsersDb = (users: User[]) => {
    localStorage.setItem('quiz-app-users-db', JSON.stringify(users));
  };

  const login = useCallback((name: string, password?: string) => {
    const users = getUsersDb();
    const existingUser = users.find(
      (u) => u.name.toLowerCase() === name.trim().toLowerCase() && u.password === (password || '')
    );

    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('quiz-app-session', JSON.stringify(existingUser));
      return { success: true };
    }

    return { success: false, error: 'Kullanıcı adı veya şifre hatalı.' };
  }, []);

  const register = useCallback((role: UserRole, name: string, password?: string, id?: string) => {
    const users = getUsersDb();
    const normalizedName = name.trim().toLowerCase();
    
    if (users.some((u) => u.name.toLowerCase() === normalizedName)) {
      return { success: false, error: 'Bu isimde bir kullanıcı zaten kayıtlı.' };
    }

    const newUser: User = {
      id: id || `${role}-${Date.now()}`,
      name: name.trim(),
      role,
      password: password || '',
    };

    users.push(newUser);
    saveUsersDb(users);
    
    // Auto-login after registration
    setUser(newUser);
    localStorage.setItem('quiz-app-session', JSON.stringify(newUser));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('quiz-app-session');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
