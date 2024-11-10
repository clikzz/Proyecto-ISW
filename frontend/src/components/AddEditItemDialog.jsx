import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addItem, updateItem } from '@/api/inventory';

const AddEditItemDialog = ({ isOpen, onClose, existingItem }) => {
  const [itemData, setItemData] = useState(existingItem || { name_item: '', category: '', stock: 0, selling_price: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (existingItem) {
        await updateItem(existingItem.id_item, itemData);
      } else {
        await addItem(itemData);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar item:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2>{existingItem ? 'Editar Item' : 'Agregar Item'}</h2>
        <Input name="name_item" value={itemData.name_item} onChange={handleChange} placeholder="Nombre del Item" />
        <Input name="category" value={itemData.category} onChange={handleChange} placeholder="Categoría" />
        <Input name="stock" type="number" value={itemData.stock} onChange={handleChange} placeholder="Stock" />
        <Input name="selling_price" type="number" value={itemData.selling_price} onChange={handleChange} placeholder="Precio de Venta" />
        <Button onClick={handleSubmit}>{existingItem ? 'Actualizar' : 'Agregar'}</Button>
      </div>
    </Dialog>
  );
};

export default AddEditItemDialog;