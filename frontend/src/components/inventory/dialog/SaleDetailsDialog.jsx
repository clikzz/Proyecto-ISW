import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';

const SaleDetailsDialog = ({ isOpen, onClose, onEdit, sale }) => {
  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detalles de la Venta
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Producto</label>
              <p className="p-2 bg-gray-100 rounded-md">{sale.name_item}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Método de Pago</label>
              <p className="p-2 bg-gray-100 rounded-md">{capitalize(sale.payment_method)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Cantidad vendida</label>
              <div className="p-2 bg-gray-100 rounded-md">
                {sale.quantity_item > 0 ? (
                  <p>{sale.quantity_item}</p>
                ) : (
                  <p>No se vendieron productos.</p>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Monto Total</label>
              <p className="p-2 bg-gray-100 rounded-md">$ {sale.amount?.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Descripción</label>
              <p className="p-2 bg-gray-100 rounded-md">
                {sale.description || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-sm space-x-4">
          <p>
            Registrado el{' '}
            <span className="font-semibold">{formatDateTime(sale.transaction_date)}</span>
          </p>
          <p>
            Modificado el{' '}
            <span className="font-semibold">{formatDateTime(sale.updated_at)}</span>
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={() => {
              onEdit(sale);
            }}
          >
            Editar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailsDialog;