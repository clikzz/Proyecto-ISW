import useAuthRedirect from '@hooks/useAuthRedirect';
import UsersTable from '@components/users/UsersTable';
import { Users } from 'lucide-react';
import { useRouter } from 'next/router';

export default function UsersPage() {
  const isAuthorized = useAuthRedirect(['admin']);

  if (!isAuthorized) {
    useRouter().push('/login');
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center">
        <Users size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>
      <UsersTable />
    </div>
  );
}
