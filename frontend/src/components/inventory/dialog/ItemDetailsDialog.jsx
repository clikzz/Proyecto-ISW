import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/helpers/dates';

const ItemDetailsDialog = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detalles del Producto
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Nombre
              </label>
              <p className="p-2 bg-gray-100 rounded-md">{item.name_item}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Categoría
              </label>
              <p className="p-2 bg-gray-100 rounded-md">{item.category}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Stock
              </label>
              <p className="p-2 bg-gray-100 rounded-md">{item.stock}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Precio de Venta
              </label>
              <p className="p-2 bg-gray-100 rounded-md">
                ${item.selling_price}
              </p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Proveedores
              </label>
              <div className="p-2 bg-gray-100 rounded-md space-y-1">
                {Array.isArray(item.suppliers) && item.suppliers.length > 0 ? (
                  item.suppliers.map((supplier, index) => (
                    <p key={index} className="text-sm">
                      {supplier?.name_supplier || 'Desconocido'}
                    </p>
                  ))
                ) : (
                  <p>Desconocido</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Descripción
              </label>
              <p className="p-2 bg-gray-100 rounded-md">
                {item.description || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center text-sm space-x-4">
          <p>
            Registrado el{' '}
            <span className="font-semibold">
              {formatDateTime(item.created_at)}
            </span>
          </p>
          <p>
            Modificado por última vez el{' '}
            <span className="font-semibold">
              {formatDateTime(item.updated_at)}
            </span>
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={() => console.log('Edit item')}
          >
            Editar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;
