import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import { Button } from '@/components/ui/button';

const SaleDetailsDialog = ({ isOpen, onClose, onEdit, sale }) => {
  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>
            Detalles de la Venta
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Producto</label>
              <p className="p-2 rounded-md border dark:border-gray-800">{sale.name_item}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Método de Pago</label>
              <p className="p-2 rounded-md border dark:border-gray-800">{capitalize(sale.payment_method)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Cantidad vendida</label>
              <div className="p-2 rounded-md border dark:border-gray-800">
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
              <label className="block text-sm font-semibold">Monto Total</label>
              <p className="p-2 rounded-md border dark:border-gray-800">$ {sale.amount?.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Descripción</label>
              <p className="p-2 rounded-md border dark:border-gray-800">
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
          <Button
            type="submit"
            onClick={() => {
              onEdit(sale);
            }}
          >
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailsDialog;