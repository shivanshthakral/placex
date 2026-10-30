import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export const DEMO_USERS = [
  {
    key: 'student',
    role: 'STUDENT',
    name: 'Aravind Swaminathan',
    email: 'aravind@srmist.edu.in',
    password: 'student123',
    subtitle: 'B.Tech CSE • 9.35 CGPA',
    avatar: 'AS',
  },
  {
    key: 'student2',
    role: 'STUDENT',
    name: 'Sneha Reddy',
    email: 'sneha@srmist.edu.in',
    password: 'student123',
    subtitle: 'B.Tech AI/ML • 8.85 CGPA',
    avatar: 'SR',
  },
  {
    key: 'recruiter',
    role: 'RECRUITER',
    name: 'Sundararajan Ramesh',
    email: 'recruiter@google.com',
    password: 'google123',
    subtitle: 'Google Talent Acquisition',
    avatar: 'G',
  },
  {
    key: 'recruiter2',
    role: 'RECRUITER',
    name: 'Ananya Deshmukh',
    email: 'recruiter@microsoft.com',
    password: 'msft123',
    subtitle: 'Microsoft Campus Lead',
    avatar: 'MS',
  },
  {
    key: 'officer',
    role: 'PLACEMENT_OFFICER',
    name: 'Dr. K. S. Ravichandran',
    email: 'officer@srmist.edu.in',
    password: 'officer123',
    subtitle: 'Head of Career Centre (Admin)',
    avatar: 'PO',
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDemoKey, setActiveDemoKey] = useState('student');

  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      setLoading(true);
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      const match = DEMO_USERS.find((d) => d.email.toLowerCase() === user.email.toLowerCase());
      if (match) setActiveDemoKey(match.key);
    } catch {
      // Not logged in or session expired, auto-login with default student for instant WOW demo experience
      try {
        const defaultUser = DEMO_USERS[0];
        const loggedUser = await api.login(defaultUser.email, defaultUser.password);
        setCurrentUser(loggedUser);
        setActiveDemoKey(defaultUser.key);
      } catch (e) {
        console.warn('Auto-login fallback failed (backend may not be running yet):', e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const user = await api.login(email, password);
    setCurrentUser(user);
    const match = DEMO_USERS.find((d) => d.email.toLowerCase() === user.email.toLowerCase());
    if (match) setActiveDemoKey(match.key);
    return user;
  }

  async function switchDemo(key) {
    const demo = DEMO_USERS.find((u) => u.key === key);
    if (!demo) return;
    try {
      setLoading(true);
      const user = await api.login(demo.email, demo.password);
      setCurrentUser(user);
      setActiveDemoKey(demo.key);
      return user;
    } catch (err) {
      console.error('Failed to switch demo account:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api.logout();
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setActiveDemoKey(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        activeDemoKey,
        login,
        logout,
        switchDemo,
        refreshUser: checkCurrentUser,
      }}
    >
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
