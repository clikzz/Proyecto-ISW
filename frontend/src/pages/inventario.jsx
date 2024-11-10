import React, { useState } from 'react';
import InventoryTable from '@/components/InventoryTable';
import AddEditItemDialog from '@/components/AddEditItemDialog';
import { Button } from '@/components/ui/button';

const InventoryPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Inventario</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Item</Button>
      </div>
      <InventoryTable />
      <AddEditItemDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default InventoryPage;