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
import { useAlert } from '@/context/alertContext';
import { getInventoryItems, recordSale } from '@/api/inventory';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { capitalize } from '@/helpers/capitalize';

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
      console.log('transaction enviada del dialog:', transaction);
      await recordSale(transaction);
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
            <Select
              value={selectedItem?.id_item || ''}
              onValueChange={(value) =>
                setSelectedItem(items.find((item) => item.id_item === parseInt(value)))
              }
            >
              <SelectTrigger>
                {selectedItem
                  ? `${selectedItem.name_item} - $${selectedItem.selling_price}`
                  : 'Selecciona un producto'}
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id_item} value={item.id_item.toString()}>
                    {item.name_item} - ${item.selling_price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                {capitalize(paymentMethod) || 'Selecciona un método'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
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