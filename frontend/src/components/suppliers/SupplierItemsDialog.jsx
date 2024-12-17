import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/helpers/dates';

export default function SupplierItemsDialog({
  items,
  isOpen,
  onClose,
  supplierName,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-background text-foreground border-transparent">
        <DialogHeader>
          <DialogTitle>Productos de {supplierName}</DialogTitle>
          <DialogDescription>
            Lista de productos del proveedor (stock global y precio de venta al
            público).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Última actualización</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id_item}>
                    <TableCell>{item.name_item}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.selling_price.toLocaleString()}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{formatDate(item.updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No hay productos disponibles para este proveedor.</p>
          )}
        </div>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
}
