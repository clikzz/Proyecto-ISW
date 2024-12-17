import useAuthRedirect from '@hooks/useAuthRedirect';
import SupplierTable from '@components/suppliers/SupplierTable';
import { Truck } from 'lucide-react';

export default function SuppliersPage() {
  const isAuthorized = useAuthRedirect(['admin']);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center">
        <Truck size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Proveedores</h1>
      </div>
      <SupplierTable />
    </div>
  );
}
