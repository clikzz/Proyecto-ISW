import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import { updateItem } from '@/api/inventory';
import { Textarea } from '@/components/ui/textarea';

const ItemDetailsDialog = ({ isOpen, onClose, item, onUpdateItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
      setIsEditing(false);
    }
  }, [item]);

  if (!item) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === 'category' ? value.toLowerCase() : value;

    setEditedItem((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSave = async () => {
    try {
      const { name_item, description, category, stock, selling_price } = editedItem;
  
      const updatedItem = {
        name_item,
        description: description || '',
        category: category.toLowerCase(),
        stock,
        selling_price,
      };
  
      const response = await updateItem(item.id_item, updatedItem);
  
      if (response) {
        onUpdateItem(response);
      }
  
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error al actualizar el item:', error);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detalles del Producto
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name_item"
                  value={editedItem.name_item}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">{capitalize(item.name_item)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Categoría</label>
              {isEditing ? (
                <Select
                  value={editedItem.category}
                  onValueChange={(value) =>
                    setEditedItem((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    {capitalize(editedItem.category) || 'Seleccionar categoría'}
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Accesorios',
                      'Bicicletas',
                      'Componentes',
                      'Equipamiento',
                      'Electrónica',
                      'Herramientas',
                      'Limpieza',
                      'Repuestos',
                      'Otros',
                    ].map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">{capitalize(item.category)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Stock</label>
              {isEditing ? (
                <input
                  type="number"
                  name="stock"
                  value={editedItem.stock}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">{item.stock}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Precio de Venta</label>
              {isEditing ? (
                <input
                  type="number"
                  name="selling_price"
                  value={editedItem.selling_price}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">${item.selling_price}</p>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Proveedores</label>
              <div className="p-2 bg-gray-100 rounded-md space-y-1">
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
              <label className="block text-sm font-semibold text-gray-700">Descripción</label>
              {isEditing ? (
                <Textarea
                  name="description"
                  value={editedItem.description}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">{item.description || 'Sin descripción'}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center text-sm space-x-4">
          <p>
            Registrado el{' '}
            <span className="font-semibold">{formatDateTime(item.created_at)}</span>
          </p>
          <p>
            Modificado por última vez el{' '}
            <span className="font-semibold">{formatDateTime(item.updated_at)}</span>
          </p>
          {isEditing ? (
            <>
              <button
                className="px-4 py-2 bg-blue-500 text-white mr-2 rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;
