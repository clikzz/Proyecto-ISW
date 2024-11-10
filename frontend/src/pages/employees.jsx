import useAuthRedirect from '@hooks/useAuthRedirect';
import EmployeeTable from '@components/EmployeeTable';
import { Users } from 'lucide-react';

export default function EmployeesPage() {
  const isAuthorized = useAuthRedirect(['admin']);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center">
        <Users size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Empleados</h1>
      </div>
      <EmployeeTable />
    </div>
  );
}
