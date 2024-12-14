import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';

const PurchaseDetailsDialog = ({ isOpen, onClose, onEdit, purchase }) => {
  if (!purchase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detalles de la Compra
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Producto</label>
              <p className="p-2 bg-gray-100 rounded-md">{purchase.name_item}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Método de Pago</label>
              <p className="p-2 bg-gray-100 rounded-md">{capitalize(purchase.payment_method)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Cantidad comprada</label>
              <p className="p-2 bg-gray-100 rounded-md">{purchase.quantity_item}</p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Monto Total</label>
              <p className="p-2 bg-gray-100 rounded-md">${purchase.amount.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Descripción</label>
              <p className="p-2 bg-gray-100 rounded-md">
                {purchase.description || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-sm space-x-4">
          <p>
            Registrado el{' '}
            <span className="font-semibold">{formatDateTime(purchase.transaction_date)}</span>
          </p>
          <p>
            Modificado el{' '}
            <span className="font-semibold">{formatDateTime(purchase.updated_at)}</span>
          </p>
          <button
            className="px-4 py-2  bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={() => {
              onEdit(purchase);
              onClose();
            }}
          >
            Editar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDetailsDialog;
