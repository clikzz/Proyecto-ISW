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
            <strong>Precio Compra:</strong> {item.cost_price}
          </p>
          <p>
            <strong>Descripción:</strong> {item.description || 'N/A'}
          </p>
          <p>
            <strong>Proveedor:</strong> {item.rut_supplier || 'N/A'}
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