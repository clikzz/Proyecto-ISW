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
import { addItem } from '@api/inventory';
import { useAlert } from '@context/alertContext';

export default function AddItemDialog({ fetchItems }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name_item: '',
    category: '',
    selling_price: '',
    cost_price: '',
    stock: '',
    rut_supplier: '',
  });
  const { showAlert } = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addItem(newItem);
      showAlert('Item añadido', 'success');
      setIsDialogOpen(false);
      setNewItem({
        name_item: '',
        category: '',
        selling_price: '',
        cost_price: '',
        stock: '',
        rut_supplier: '',
      });
      fetchItems();
    } catch (error) {
      showAlert('Error al añadir el item', 'error');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-500 text-white">
          <ShoppingCart size="16" />
          Añadir Item
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Formulario de nuevo ítem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name_item">Nombre</Label>
            <Input
              id="name_item"
              name="name_item"
              value={newItem.name_item}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              placeholder="Categoría"
              required
            />
          </div>
          <div>
            <Label htmlFor="selling_price">Precio Venta</Label>
            <Input
              id="selling_price"
              name="selling_price"
              type="number"
              value={newItem.selling_price}
              onChange={handleInputChange}
              placeholder="Precio de venta"
              required
            />
          </div>
          <div>
            <Label htmlFor="cost_price">Precio Compra</Label>
            <Input
              id="cost_price"
              name="cost_price"
              type="number"
              value={newItem.cost_price}
              onChange={handleInputChange}
              placeholder="Precio de compra"
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={newItem.stock}
              onChange={handleInputChange}
              placeholder="Stock disponible"
              required
            />
          </div>
          <div>
            <Label htmlFor="rut_supplier">RUT del Proveedor</Label>
            <Input
              id="rut_supplier"
              name="rut_supplier"
              value={newItem.rut_supplier}
              onChange={handleInputChange}
              placeholder="12.345.678-9"
              required
            />
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
