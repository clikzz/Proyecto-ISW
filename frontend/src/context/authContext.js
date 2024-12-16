'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Cambiar a 'next/router'
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

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  const checkAuth = async () => {
    console.log('Current route:', router.pathname); // Verificar que router.pathname esté definido

    console.log('Inside checkAuth function');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found:', token);
      const { isValid, role: fetchedRole } = await validateToken(token);
      if (isValid) {
        console.log('Token is valid');
        setIsAuthenticated(true);
        setRole(fetchedRole);
      } else {
        console.log('Token inválido');
        handleLogout();
      }
    } else {
      console.log('No token found');
      if (!publicRoutes.includes(router.pathname)) {
        console.log('Redirecting to login', router.pathname);

        handleLogout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('Executing checkAuth');
    checkAuth();
  }, [router.pathname]);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
