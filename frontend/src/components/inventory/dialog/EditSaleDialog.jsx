import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { updateSale } from '@/api/inventory';

const EditSaleDialog = ({ isOpen, onClose, sale, onUpdateSale }) => {
  const [editedSale, setEditedSale] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (sale) {
      setEditedSale({
        ...sale,
        quantity_item: sale.quantity_item,
        payment_method: sale.payment_method,
        description: sale.description || '',
      });
      setTotal(sale.quantity_item * sale.unit_price);
    }
  }, [sale]);

  useEffect(() => {
    if (sale && editedSale.quantity_item) {
      setTotal(editedSale.quantity_item * sale.unit_price);
    }
  }, [editedSale.quantity_item, sale]);

  if (!sale) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const unitPrice = sale.unit_price || editedSale.unit_price;
      const totalAmount = editedSale.quantity_item * sale.unit_price;

      const updatedFields = {
        items: [
          {
            id_transaction_item: sale.id_transaction_item,
            quantity_item: editedSale.quantity_item,
            unit_price: unitPrice,
          },
        ],
        details: {
          amount: totalAmount,
          payment_method: editedSale.payment_method,
          description: editedSale.description,
        },
      };

      const response = await updateSale(sale.id_transaction, updatedFields);
      if (response) {
        onUpdateSale(response);
      }
      onClose();
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white p-6 rounded-md shadow-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Editar Venta
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Producto (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto</label>
            <Input
              value={`${sale.name_item} - $${sale.unit_price}`}
              readOnly
              className="p-2 border rounded-md w-full bg-gray-100"
            />
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <Input
              type="number"
              name="quantity_item"
              value={editedSale.quantity_item}
              onChange={handleInputChange}
              min={1}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <Select
              value={editedSale.payment_method}
              onValueChange={(value) =>
                setEditedSale((prev) => ({ ...prev, payment_method: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monto Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto Total</label>
            <Input
              value={`$${total.toFixed(2)}`}
              readOnly
              className="p-2 border rounded-md w-full bg-gray-100"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <Textarea
              name="description"
              value={editedSale.description}
              onChange={handleInputChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSave}
          >
            Guardar Cambios
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSaleDialog;
