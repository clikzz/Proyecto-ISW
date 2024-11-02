'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/authContext';

const useAuthRedirect = (requiredRoles) => {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (!requiredRoles.includes(role)) {
        router.push('/home');
      }
    }
  }, [isAuthenticated, role, loading, router, requiredRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !requiredRoles.includes(role)) {
    return null;
  }

  return true;
};

export default useAuthRedirect;
