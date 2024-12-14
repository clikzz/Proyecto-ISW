import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { updatePurchase } from '@/api/inventory';
import { Textarea } from '@/components/ui/textarea';

const EditPurchaseDialog = ({ isOpen, onClose, purchase, onUpdatePurchase }) => {
  const [editedPurchase, setEditedPurchase] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (purchase) {
      setEditedPurchase({
        ...purchase,
        quantity_item: purchase.quantity_item,
        payment_method: purchase.payment_method,
        description: generateDescription(purchase.quantity_item, purchase.name_item),
      });
      setTotal(purchase.quantity_item * purchase.unit_price);
    }
  }, [purchase]);

  // Recalcula el total cuando la cantidad o el precio unitario cambian
  useEffect(() => {
    if (editedPurchase.quantity_item && editedPurchase.unit_price) {
      setTotal(editedPurchase.quantity_item * editedPurchase.unit_price);
      setEditedPurchase((prev) => ({
        ...prev,
        description: generateDescription(editedPurchase.quantity_item, purchase.name_item),
      }));
    }
  }, [editedPurchase.quantity_item, editedPurchase.unit_price, purchase]);

  // Función para generar la descripción dinámica
  const generateDescription = (quantity, productName) => {
    return `Compra de ${quantity || 1} unidades de ${productName || 'producto'}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPurchase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const totalAmount = editedPurchase.quantity_item * editedPurchase.unit_price;

      const updatedFields = {
        items: [
          {
            id_transaction_item: purchase.id_transaction_item,
            quantity_item: editedPurchase.quantity_item,
            unit_price: editedPurchase.unit_price,
          },
        ],
        details: {
          amount: totalAmount,
          payment_method: editedPurchase.payment_method,
          description: editedPurchase.description,
        },
      };

      const response = await updatePurchase(purchase.id_transaction, updatedFields);
      if (response) {
        onUpdatePurchase(response);
      }
      onClose();
    } catch (error) {
      console.error('Error al actualizar la compra:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white p-6 rounded-md shadow-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Editar Compra
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Producto (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto</label>
            <Input
              value={purchase.name_item}
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
              value={editedPurchase.quantity_item}
              onChange={handleInputChange}
              min={1}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* Precio Unitario */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
            <Input
              type="number"
              name="unit_price"
              value={editedPurchase.unit_price}
              onChange={handleInputChange}
              min={0}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <Select
              value={editedPurchase.payment_method}
              onValueChange={(value) =>
                setEditedPurchase((prev) => ({ ...prev, payment_method: value }))
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
              value={editedPurchase.description}
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

export default EditPurchaseDialog;