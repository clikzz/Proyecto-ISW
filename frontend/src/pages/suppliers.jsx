import React, { useState } from 'react';
import SupplierTable from '@components/SupplierTable';

function SuppliersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Proveedores</h1>
      </div>
      <SupplierTable />
    </div>
  );
}

export default SuppliersPage;
