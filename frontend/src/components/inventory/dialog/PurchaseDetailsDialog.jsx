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

const PurchaseDetailsDialog = ({ isOpen, onClose, onEdit, purchase }) => {
  if (!purchase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>
            Detalles de la Compra
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Producto</label>
              <p className="p-2 rounded-md border dark:border-gray-800">{purchase.name_item}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Método de Pago</label>
              <p className="p-2 rounded-md border dark:border-gray-800">{capitalize(purchase.payment_method)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Cantidad comprada</label>
              <p className="p-2 rounded-md border dark:border-gray-800">{purchase.quantity_item}</p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Monto Total</label>
              <p className="p-2 rounded-md border dark:border-gray-800">${purchase.amount.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Proveedor</label>
              <p className="p-2 rounded-md border dark:border-gray-800">
                {purchase.name_supplier || 'Sin Proveedor'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Descripción</label>
              <p className="p-2 rounded-md border dark:border-gray-800">
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
          <Button
            type="submit"
            onClick={() => {
              onEdit(purchase);
              onClose();
            }}
          >
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDetailsDialog;
