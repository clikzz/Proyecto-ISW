import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { updateItem } from '@/api/inventory';
import { Textarea } from '@/components/ui/textarea';

const EditItemDialog = ({ isOpen, onClose, item, onUpdateItem }) => {
  const [editedItem, setEditedItem] = useState({});

  useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    }
  }, [item]);

  if (!item) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Filtrar solo los campos que han sido editados
      const updatedFields = {};
      for (const key in editedItem) {
        if (editedItem[key] !== item[key]) {
          updatedFields[key] = editedItem[key];
        }
      }
  
      // Enviar solo los campos actualizados
      const response = await updateItem(item.id_item, updatedFields);
  
      if (response) {
        onUpdateItem(); // Actualizar el elemento en la tabla
      }
      onClose();
    } catch (error) {
      console.error('Error al actualizar el ítem:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Editar Producto</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombre</label>
              <input
                type="text"
                name="name_item"
                value={editedItem.name_item}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Categoría</label>
              <Select
                value={editedItem.category}
                onValueChange={(value) =>
                  setEditedItem((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar categoría" />
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
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={editedItem.stock}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Precio de Venta</label>
              <input
                type="number"
                name="selling_price"
                value={editedItem.selling_price}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Descripción</label>
              <Textarea
                name="description"
                value={editedItem.description || ''}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;