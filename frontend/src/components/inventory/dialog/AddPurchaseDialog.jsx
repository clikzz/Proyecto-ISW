import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import ExistingPurchaseForm from '@/components/inventory/dialog/ExistingPurchaseForm';
import NewPurchaseForm from '@/components/inventory/dialog/NewPurchaseForm';
import { getInventoryItems, recordPurchase } from '@/api/inventory';
import { getSuppliers } from '@/api/suppliers';
import { useAlert } from '@/context/alertContext';

export default function AddPurchaseDialog({ fetchPurchases }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const { showAlert } = useAlert();
  const [purchaseDetails, setPurchaseDetails] = useState({
    type: 'compra',
    items: [{ id_item: '', quantity: 1, unit_price: '' }],
    details: {
      payment_method: '',
      amount: '',
      description: '',
    },
  });
  const [newItem, setNewItem] = useState({
    name_item: '',
    category: '',
    description: '',
    quantity: '',
    unit_price: '',
    selling_price: '',
    rut_supplier: '',
  });

  useEffect(() => {
    if (isDialogOpen) {
      getSuppliers().then(setSuppliers);
      getInventoryItems().then(setItems);
    }
  }, [isDialogOpen]);

  const handleSubmit = async () => {
    try {
      let transaction;
  
      if (activeTab === 'existing') {
        transaction = { ...purchaseDetails };
      } else {
        const { payment_method, ...itemValues } = newItem;
  
        transaction = {
          type: 'compra',
          items: [{ ...itemValues }],
          details: {
            ...purchaseDetails.details,
            payment_method,
          },
        };
      }
  
      await recordPurchase(transaction);
      showAlert('Compra registrada con éxito', 'success');
      fetchPurchases();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      showAlert('Error al registrar la compra', 'error');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'existing':
        return (
          <ExistingPurchaseForm
            purchaseDetails={purchaseDetails}
            setPurchaseDetails={setPurchaseDetails}
            items={items}
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier}
            suppliers={suppliers}
          />
        );
      case 'new':
        return (
          <NewPurchaseForm
            newItem={newItem}
            setNewItem={setNewItem}
            suppliers={suppliers}
            purchaseDetails={purchaseDetails}
            setPurchaseDetails={setPurchaseDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShoppingCart size="16"/>
          Registrar Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground max-w-3xl mx-auto p-8">
        <DialogHeader>
          <DialogTitle>Formulario de Compra</DialogTitle>
        </DialogHeader>
        {/* Tabs para cambiar entre Producto Existente y Nuevo Producto */}
        <div className="flex justify-start space-x-4 border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === 'existing' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('existing')}
          >
            Producto Existente
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'new' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('new')}
          >
            Nuevo Producto
          </button>
        </div>

        {/* Renderizado del formulario activo */}
        <div>{renderActiveTab()}</div>
        <Button 
          className="mt-6 max-w-xs mx-auto"
          onClick={handleSubmit}>
            Registrar Compra
        </Button>
      </DialogContent>
    </Dialog>
  );
}