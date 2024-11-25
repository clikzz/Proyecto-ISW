import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { getInventoryItems, recordTransaction } from '@api/inventory';
import { useAlert } from '@context/alertContext';
import { useAuth } from '@context/authContext';
import AddItemDialog from '@/components/inventory/dialog/AddItemDialog';

export default function AddPurchaseDialog({ fetchPurchases }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const fetchInventory = async () => {
    try {
      const data = await getInventoryItems();
      console.log('Inventario:', data);
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem || !quantity) {
      showAlert('Selecciona un producto e ingresa la cantidad', 'error');
      return;
    }

    try {
      const transaction = {
        type: 'compra',
        items: [{ id_item: selectedItem.id_item, cantidad: Number(quantity) }],
        details: {
          rut: user.rut,
          amount: selectedItem.cost_price * Number(quantity),
          payment_method: 'efectivo',
          description: `Compra de ${quantity} ${selectedItem.name_item}`,
        },
      };
      await recordTransaction(transaction);
      showAlert('Compra registrada exitosamente', 'success');
      fetchPurchases();
      setIsDialogOpen(false);
    } catch (error) {
      showAlert('Error al registrar la compra', 'error');
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-green-500 text-white">
            <ShoppingCart size="16" />
            Añadir Compra
          </Button>
        </DialogTrigger>
        <DialogContent className="border-none text-foreground">
          <DialogHeader>
            <DialogTitle>Registrar Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="search">Buscar Producto</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre del producto"
            />
            <div className="overflow-y-auto max-h-64 border p-2">
              {filteredInventory.length ? (
                filteredInventory.map((item) => (
                  <div
                    key={item.id_item}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      selectedItem?.id_item === item.id_item
                        ? 'bg-blue-100'
                        : ''
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <span>{item.name_item}</span>
                    <span>${item.cost_price}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No se encontraron productos</p>
              )}
            </div>

            {selectedItem && (
              <div>
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Cantidad"
                  required
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                className="bg-blue-500 text-white"
                onClick={handleConfirmPurchase}
                disabled={!selectedItem || !quantity}
              >
                Confirmar Compra
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsAddItemDialogOpen(true);
                }}
              >
                ¿No ves el producto?
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddItemDialog
        isOpen={isAddItemDialogOpen}
        onClose={() => setIsAddItemDialogOpen(false)}
        fetchInventory={fetchInventory}
      />
    </>
  );
}
