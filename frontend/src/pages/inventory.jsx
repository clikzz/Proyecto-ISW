import React from 'react';
import InventoryTable from '@/components/inventory/InventoryTable';
import SalesTable from '@/components/inventory/SalesTable';
import PurchasesTable from '@/components/inventory/PurchasesTable';
import { Package } from 'lucide-react';

export default function Inventory() {
  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6">
        <Package size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Inventario</h1>
      </div>

      <InventoryTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      </div>

      <SalesTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      </div>

      <PurchasesTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      </div>
    </div>
  );
}