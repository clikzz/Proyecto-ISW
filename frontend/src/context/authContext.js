'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '@/api/auth';

const AuthContext = createContext({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      if (token && storedRole) {
        const isValid = await validateToken(token);
        if (isValid) {
          setIsAuthenticated(true);
          setRole(storedRole);
        } else {
          setIsAuthenticated(false);
          setRole(null);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.push('/login');
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
        router.push('/login');
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
