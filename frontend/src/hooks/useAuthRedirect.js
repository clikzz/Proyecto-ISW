import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/authContext';

const useAuthRedirect = (requiredRoles) => {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
    if (!loading && !requiredRoles.includes(role)) {
      router.push('/home');
      console.log(loading, isAuthenticated, role);
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
