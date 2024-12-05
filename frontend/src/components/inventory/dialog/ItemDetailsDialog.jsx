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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Producto</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {item.id_item}
          </p>
          <p>
            <strong>Nombre:</strong> {item.name_item}
          </p>
          <p>
            <strong>Categoría:</strong> {item.category}
          </p>
          <p>
            <strong>Stock:</strong> {item.stock}
          </p>
          <p>
            <strong>Precio Venta:</strong> {item.selling_price}
          </p>
          <p>
            <strong>Descripción:</strong> {item.description || ''}
          </p>
          <p>
            <strong>Proveedores:</strong>{' '}
            {Array.isArray(item.suppliers) && item.suppliers.length > 0 ? (
              item.suppliers.map((supplier, index) => (
                <span key={index}>
                  {supplier || 'Desconocido'}
                  {index < item.suppliers.length - 1 && ', '}
                </span>
              ))
            ) : (
              'Desconocido'
            )}
          </p>
          <p>
            <strong>Registrado:</strong> {formatDateTime(item.created_at)}
          </p>
          <p>
            <strong>Actualizado:</strong> {formatDateTime(item.updated_at)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;