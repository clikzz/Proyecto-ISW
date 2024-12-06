import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { getInventoryItems, recordTransaction } from '@/api/inventory';
import { getSuppliers } from '@/api/suppliers';
import { useAlert } from '@/context/alertContext';
import { capitalize } from '@/helpers/capitalize';

export default function AddPurchaseDialog({ fetchPurchases }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [section, setSection] = useState('existing');
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [purchaseDetails, setPurchaseDetails] = useState({
    type: 'compra',
    items: [{ id_item: '', quantity: '', unit_price: '' }],
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

  const { showAlert } = useAlert();

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const itemsData = await getInventoryItems();
      setItems(itemsData);
    } catch (error) {
      console.error('Error al obtener inventario:', error);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchSuppliers();
      fetchInventoryItems();
    }
  }, [isDialogOpen]);

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();

    try {
      const transaction = { ...purchaseDetails };

      if (section === 'new') {
        transaction.items = [{ ...newItem }];
      }

      transaction.details.amount = transaction.items.reduce(
        (total, item) => total + item.quantity * item.unit_price,
        0
      );

      await recordTransaction(transaction);
      showAlert('Compra registrada exitosamente', 'success');
      setIsDialogOpen(false);
      await fetchPurchases();
    } catch (error) {
      showAlert('Error al registrar la compra', 'error');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Añadir Compra</Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Añadir Compra</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 mb-4">
          <Button variant={section === 'existing' ? 'solid' : 'outline'} onClick={() => setSection('existing')}>
            Producto Existente
          </Button>
          <Button variant={section === 'new' ? 'solid' : 'outline'} onClick={() => setSection('new')}>
            Nuevo Producto
          </Button>
        </div>
        {section === 'existing' && (
          <form onSubmit={handlePurchaseSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product">Producto</Label>
              <Select
                value={purchaseDetails.items[0].id_item || ''}
                onValueChange={(value) =>
                  setPurchaseDetails((prev) => ({
                    ...prev,
                    items: [{ ...prev.items[0], id_item: parseInt(value, 10) }],
                  }))
                }
              >
                <SelectTrigger>
                  <span>
                    {purchaseDetails.items[0].id_item
                      ? items.find((item) => item.id_item === purchaseDetails.items[0].id_item)?.name_item
                      : 'Seleccionar producto'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id_item} value={item.id_item.toString()}>
                      {item.name_item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplier">Proveedor</Label>
              <Select
                value={selectedSupplier}
                onValueChange={(value) => setSelectedSupplier(value)}
              >
                <SelectTrigger>
                  {selectedSupplier
                    ? suppliers.find((sup) => sup.rut_supplier === selectedSupplier)?.name_supplier
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
            <div>
              <Label htmlFor="payment_method">Método de Pago</Label>
              <Select
                value={purchaseDetails.details.payment_method}
                onValueChange={(value) =>
                  setPurchaseDetails((prev) => ({
                    ...prev,
                    details: { ...prev.details, payment_method: value },
                  }))
                }
              >
                <SelectTrigger>
                  {capitalize(purchaseDetails.details.payment_method) || 'Seleccionar método de pago'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={purchaseDetails.items[0].quantity}
                onChange={(e) =>
                  setPurchaseDetails((prev) => ({
                    ...prev,
                    items: [{ ...prev.items[0], quantity: parseInt(e.target.value, 10) }],
                  }))
                }
                placeholder="Cantidad comprada"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit_price">Precio Unitario</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                value={purchaseDetails.items[0].unit_price}
                onChange={(e) =>
                  setPurchaseDetails((prev) => ({
                    ...prev,
                    items: [{ ...prev.items[0], unit_price: parseFloat(e.target.value) }],
                  }))
                }
                placeholder="Precio unitario de compra"
                required
              />
            </div>
            <Button type="submit">Registrar Compra</Button>
          </form>
        )}
        {section === 'new' && (
          <form onSubmit={handlePurchaseSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name_item">Nombre</Label>
              <Input
                id="name_item"
                name="name_item"
                value={newItem.name_item}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name_item: e.target.value }))}
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
                onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                value={newItem.description}
                onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del producto"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: parseInt(e.target.value, 10) }))}
                placeholder="Cantidad comprada"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit_price">Precio Unitario</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                value={newItem.unit_price}
                onChange={(e) => setNewItem((prev) => ({ ...prev, unit_price: parseFloat(e.target.value) }))}
                placeholder="Precio unitario de compra"
                required
              />
            </div>
            <div>
              <Label htmlFor="selling_price">Precio de Venta</Label>
              <Input
                id="selling_price"
                name="selling_price"
                type="number"
                value={newItem.selling_price}
                onChange={(e) => setNewItem((prev) => ({ ...prev, selling_price: parseFloat(e.target.value) }))}
                placeholder="Establecer precio de venta"
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
            <div>
              <Label htmlFor="payment_method">Método de Pago</Label>
              <Select
                value={purchaseDetails.details.payment_method}
                onValueChange={(value) =>
                  setPurchaseDetails((prev) => ({
                    ...prev,
                    details: { ...prev.details, payment_method: value },
                  }))
                }
              >
                <SelectTrigger>
                  {purchaseDetails.details.payment_method || 'Seleccionar método de pago'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Registrar Compra</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
