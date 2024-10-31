'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useRole } from '@/context/roleContext';
import EmployeeList from '@components/EmployeeList';

export default function EmployeesPage() {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>
      <EmployeeList />
    </div>
  );
}
