'use client';

import useAuthRedirect from '@hooks/useAuthRedirect';
import EmployeeList from '@components/EmployeeList';
import { Users } from 'lucide-react';

export default function EmployeesPage() {
  const isAuthorized = useAuthRedirect(['admin']);

  if (!isAuthorized) {
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
