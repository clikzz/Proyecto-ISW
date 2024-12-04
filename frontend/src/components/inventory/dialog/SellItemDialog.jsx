import React, { useState, useEffect } from 'react';
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
import { recordTransaction } from '@/api/inventory';
import { useAlert } from '@/context/alertContext';
import { getInventoryItems } from '@/api/inventory';

export default function SellItemDialog({ fetchSales }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const { showAlert } = useAlert();

  useEffect(() => {
    if (isDialogOpen) {
      const fetchItems = async () => {
        try {
          const data = await getInventoryItems();
          setItems(data);
        } catch (error) {
          console.error('Error al obtener los ítems:', error);
        }
      };
      fetchItems();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (selectedItem) {
      setTotal(selectedItem.selling_price * quantity);
    }
  }, [selectedItem, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || quantity <= 0) {
      showAlert('Selecciona un producto válido y una cantidad mayor a 0', 'error');
      return;
    }
  
    const transaction = {
      type: 'venta',
      items: [
        {
          id_item: selectedItem.id_item,
          quantity,
          unit_price: selectedItem.selling_price,
        },
      ],
      details: {
        amount: total,
        payment_method: paymentMethod.toLowerCase(),
        description: `Venta de ${quantity} unidades de ${selectedItem.name_item}`,
      },
    };
  
    try {
      await recordTransaction(transaction);
      showAlert('Venta registrada exitosamente', 'success');
      setIsDialogOpen(false);
      setSelectedItem(null);
      setQuantity(1);
      setTotal(0);
      setPaymentMethod('');
      fetchSales();
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      showAlert('Error al registrar la venta', 'error');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-green-500 text-white">
          <ShoppingCart size="16" />
          Registrar Venta
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Formulario de Venta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="item">Producto</Label>
            <select
              id="item"
              className="w-full border border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setSelectedItem(items.find((item) => item.id_item === parseInt(e.target.value)))
              }
            >
              <option value="">Selecciona un producto</option>
              {items.map((item) => (
                <option key={item.id_item} value={item.id_item}>
                  {item.name_item} - ${item.selling_price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min={1}
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentMethod">Método de Pago</Label>
            <select
              id="paymentMethod"
              className="w-full border border-gray-300 rounded-md p-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Selecciona un método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
          <div>
            <Label htmlFor="total">Monto Total</Label>
            <Input id="total" type="text" value={`$${total.toFixed(2)}`} readOnly />
          </div>
          <Button type="submit" className="bg-blue-500 text-white">
            Confirmar Venta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}