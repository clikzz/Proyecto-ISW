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
import { useAlert } from '@/context/alertContext';

const EditSaleDialog = ({ isOpen, onClose, sale, onUpdateSale }) => {
  const [editedSale, setEditedSale] = useState({});
  const [total, setTotal] = useState(0);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (sale) {
      setEditedSale({
        ...sale,
        quantity_item: sale.quantity_item,
        payment_method: sale.payment_method,
        description: sale.description || generateDescription(sale.quantity_item, sale.name_item),
      });
      setTotal(sale.quantity_item * sale.unit_price);
    }
  }, [sale]);

  // Recalcula el total y actualiza la descripción cuando cambia la cantidad
  useEffect(() => {
    if (editedSale.quantity_item && sale) {
      setTotal(editedSale.quantity_item * sale.unit_price);
      setEditedSale((prev) => ({
        ...prev,
        description: generateDescription(editedSale.quantity_item, sale.name_item),
      }));
    }
  }, [editedSale.quantity_item, sale]);

  if (!sale) return null;

  // Función para generar la descripción dinámica
  const generateDescription = (quantity, productName) => {
    return `Venta de ${quantity || 1} unidades de ${productName || 'producto'}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSale((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      showAlert('Venta actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
      showAlert('Ocurrió un error al actualizar la venta', 'error');
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Editar Venta
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Producto</label>
              <Input
                value={`${sale.name_item} - $${sale.unit_price}`}
                readOnly
                className="p-2 border rounded-md w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Método de Pago</label>
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
            <div>
              <label className="block text-sm font-semibold text-gray-700">Cantidad vendida</label>
              <Input
                type="number"
                name="quantity_item"
                value={editedSale.quantity_item}
                onChange={handleInputChange}
                min={1}
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Monto Total</label>
              <Input
                value={`$${total.toLocaleString('es-CL')}`}
                readOnly
                className="p-2 border rounded-md w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Descripción</label>
              <Textarea
                name="description"
                value={editedSale.description}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
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
