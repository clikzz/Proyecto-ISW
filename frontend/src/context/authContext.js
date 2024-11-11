'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '@/api/auth';

const AuthContext = createContext({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
  updateRole: () => {},
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
      if (token) {
        const { isValid, role: fetchedRole } = await validateToken(token);
        if (isValid) {
          setIsAuthenticated(true);
          setRole(fetchedRole);
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRole(null);
    router.push('/login');
  };

  const handleUpdateRole = (newRole) => {
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        login: handleLogin,
        logout: handleLogout,
        updateRole: handleUpdateRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
