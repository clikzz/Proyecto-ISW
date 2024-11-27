import React, { useState } from 'react';
import InventoryTable from '@/components/inventory/InventoryTable';
import SalesTable from '@/components/inventory/SalesTable';
import PurchasesTable from '@/components/inventory/PurchasesTable';
import { Package } from 'lucide-react';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('products');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <InventoryTable />;
      case 'purchases':
        return <PurchasesTable />;
      case 'sales':
        return <SalesTable />;
      default:
        return <InventoryTable />;
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-10">
      <div className="flex items-center mb-6">
        <Package size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Inventario</h1>
      </div>

      <div className="flex justify-start space-x-4 border-b mb-6">
        <button
          className={`py-2 px-4 ${
            activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Productos
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'purchases' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('purchases')}
        >
          Compras
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'sales' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('sales')}
        >
          Ventas
        </button>
      </div>

      <div>{renderActiveTab()}</div>
    </div>
  );
}