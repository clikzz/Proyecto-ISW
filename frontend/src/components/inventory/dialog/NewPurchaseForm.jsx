import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { capitalize } from '@/helpers/capitalize';

export default function NewPurchaseForm({
  newItem,
  setNewItem,
  suppliers,
  purchaseDetails,
  setPurchaseDetails,
}) {
  // Calcular monto y descripción dinámicamente
  useEffect(() => {
    if (newItem.quantity && newItem.unit_price) {
      const amount = newItem.quantity * newItem.unit_price;

      setPurchaseDetails((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          amount,
          description: `Compra de ${newItem.quantity} unidades de ${newItem.name_item || 'producto nuevo'}`,
        },
      }));
    }
  }, [newItem.quantity, newItem.unit_price, newItem.name_item, setPurchaseDetails]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Columna Izquierda */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name_item">Nombre</Label>
          <Input
            id="name_item"
            value={newItem.name_item}
            onChange={(e) => setNewItem((prev) => ({ ...prev, name_item: e.target.value }))}
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={newItem.category}
            onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>{capitalize(newItem.category) || 'Seleccionar categoría'}</SelectTrigger>
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
          <Label htmlFor="selling_price">Precio de Venta</Label>
          <Input
            id="selling_price"
            type="number"
            value={newItem.selling_price}
            onChange={(e) => setNewItem((prev) => ({ ...prev, selling_price: parseFloat(e.target.value) }))}
            placeholder="Establecer precio de venta"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            value={newItem.description}
            onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción del producto"
          />
        </div>
      </div>
      {/* Columna Derecha */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="supplier">Proveedor</Label>
          <Select
            value={newItem.rut_supplier}
            onValueChange={(value) => setNewItem((prev) => ({ ...prev, rut_supplier: value }))}
          >
            <SelectTrigger>{newItem.rut_supplier || 'Seleccionar proveedor'}</SelectTrigger>
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
            type="number"
            value={newItem.unit_price}
            onChange={(e) => setNewItem((prev) => ({ ...prev, unit_price: parseFloat(e.target.value) }))}
            placeholder="Precio unitario de compra"
            required
          />
        </div>
      </div>
    </div>
  );
}
