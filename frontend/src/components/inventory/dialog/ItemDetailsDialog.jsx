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

const ItemDetailsDialog = ({ isOpen, onClose, item, onEdit }) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>
            Detalles del Producto
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Nombre</label>
              <p className="p-2 rounded-md border dark:border-gray-700">{capitalize(item.name_item)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Categoría</label>
              <p className="p-2 rounded-md border dark:border-gray-700">{capitalize(item.category)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Stock</label>
              <p className="p-2 rounded-md border dark:border-gray-700">{item.stock}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold">Precio de Venta</label>
              <p className="p-2 rounded-md border dark:border-gray-700">${item.selling_price?.toLocaleString('es-CL')}</p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Proveedores</label>
              <div className="p-2 rounded-md space-y-1 border dark:border-gray-700">
                {Array.isArray(item.suppliers) && item.suppliers.length > 0 ? (
                  item.suppliers.map((supplier) => (
                    <p key={supplier.rut_supplier} className="text-sm">
                      {supplier.name_supplier || 'No Registrado'}
                    </p>
                  ))
                ) : (
                  <p>No Registrado</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold">Descripción</label>
              <p className="p-2 rounded-md border dark:border-gray-700">
                {item.description || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>

        {/* Fecha de registro */}
        <div className="mt-6 flex justify-between items-center text-sm space-x-4">
          <p>
            Registrado el{' '}
            <span className="font-semibold">{formatDateTime(item.created_at)}</span>
          </p>
          <p>
            Modificado por última vez el{' '}
            <span className="font-semibold">{formatDateTime(item.updated_at)}</span>
          </p>

          {/* Botón para Editar */}
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => onEdit(item)}
          >
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;
