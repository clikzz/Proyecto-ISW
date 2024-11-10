import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getInventoryItems, deleteItem } from '@/api/inventory';

const InventoryTable = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getInventoryItems();
        setItems(data);
      } catch (error) {
        console.error('Error al cargar los items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar el item:', error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Precio Venta</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id_item}>
            <TableCell>{item.name_item}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.stock}</TableCell>
            <TableCell>{item.selling_price}</TableCell>
            <TableCell>
              <Button onClick={() => handleDelete(item.id_item)} variant="destructive">Eliminar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;