'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/authContext';
import EmployeeList from '@components/EmployeeList';
import { Users } from 'lucide-react';

export default function EmployeesPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== 'admin')) {
      router.push('/home');
      console.log(loading, isAuthenticated, role);
    }
  }, [isAuthenticated, role, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 ">
        <Users />
        <h1 className="text-2xl font-bold mb-4">Empleados</h1>
      </div>
      <EmployeeList />
    </div>
  );
}
