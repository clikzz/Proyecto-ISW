import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { addItem } from '@api/inventory';
import { getSuppliers } from '@/api/suppliers';
import { useAlert } from '@context/alertContext';
import { capitalize } from '@/helpers/capitalize';

export default function AddItemDialog({ fetchItems }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [newItem, setNewItem] = useState({
    name_item: '',
    category: '',
    selling_price: '',
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
        stock: '',
        rut_supplier: '',
      });
      fetchItems();
    } catch (error) {
      showAlert('Error al añadir el item', 'error');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };
  
  useEffect(() => {
    if (isDialogOpen) {
      fetchSuppliers();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="items-center gap-2 bg-blue-500 text-white">
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
          <Select
            value={newItem.category}
            onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              {capitalize(newItem.category) || 'Seleccionar categoría'}
            </SelectTrigger>
            <SelectContent>
              {[
                'Accesorios',
                'Bicicletas',
                'Componentes',
                'Equipamiento',
                'Electrónica',
                'Herramientas',
                'Limpieza',
                'Repuestos',
                'Otros',
              ].map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <Label htmlFor="supplier">Proveedor</Label>
            <Select
              value={newItem.rut_supplier}
              onValueChange={(value) => setNewItem((prev) => ({ ...prev, rut_supplier: value }))}
            >
              <SelectTrigger>
                {newItem.rut_supplier
                  ? suppliers.find((sup) => sup.rut_supplier === newItem.rut_supplier)?.name_supplier
                  : 'Seleccionar proveedor'}
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.rut_supplier} value={supplier.rut_supplier}>
                    {supplier.name_supplier} - {supplier.rut_supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center">
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
