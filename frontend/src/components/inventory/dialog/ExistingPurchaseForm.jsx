import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { capitalize } from '@/helpers/capitalize';

export default function ExistingPurchaseForm({
  purchaseDetails,
  setPurchaseDetails,
  items,
  selectedSupplier,
  setSelectedSupplier,
  suppliers,
}) {
  const selectedItem = items.find((item) => item.id_item === purchaseDetails.items[0].id_item);

  // Efecto para recalcular el monto y la descripción
  useEffect(() => {
    if (purchaseDetails.items[0].quantity && purchaseDetails.items[0].unit_price) {
      const amount = purchaseDetails.items[0].quantity * purchaseDetails.items[0].unit_price;

      setPurchaseDetails((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          amount,
          description: `Compra de ${purchaseDetails.items[0].quantity} unidades de ${
            selectedItem?.name_item || 'producto'
          }`,
        },
      }));
    }
  }, [purchaseDetails.items[0].quantity, purchaseDetails.items[0].unit_price, selectedItem, setPurchaseDetails]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Columna Izquierda */}
      <div className="space-y-4">
        {/* Producto */}
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
                {selectedItem ? selectedItem.name_item : 'Seleccionar producto'}
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

        {/* Cantidad */}
        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            value={purchaseDetails.items[0].quantity}
            onChange={(e) =>
              setPurchaseDetails((prev) => ({
                ...prev,
                items: [{ ...prev.items[0], quantity: Number(e.target.value) }],
              }))
            }
            placeholder="Cantidad comprada"
          />
        </div>

        {/* Precio Unitario */}
        <div>
          <Label htmlFor="unit_price">Precio Unitario</Label>
          <Input
            id="unit_price"
            type="number"
            value={purchaseDetails.items[0].unit_price}
            onChange={(e) =>
              setPurchaseDetails((prev) => ({
                ...prev,
                items: [{ ...prev.items[0], unit_price: parseFloat(e.target.value) }],
              }))
            }
            placeholder="Precio unitario de compra"
          />
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="space-y-4">
        {/* Proveedor */}
        <div>
          <Label htmlFor="supplier">Proveedor</Label>
          <Select
            value={selectedSupplier}
            onValueChange={(value) => {
              setSelectedSupplier(value);
              setPurchaseDetails((prev) => ({
                ...prev,
                items: [{ ...prev.items[0], rut_supplier: value }],
              }));
            }}
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

        {/* Método de Pago */}
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
      </div>
    </div>
  );
}
