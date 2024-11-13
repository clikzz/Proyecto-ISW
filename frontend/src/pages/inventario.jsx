import React from 'react';
import InventoryTable from '@/components/InventoryTable';
import { Package } from 'lucide-react';

export default function Inventory() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Package size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Inventario</h1>
      </div>

      <InventoryTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      </div>
    </div>
  );
}