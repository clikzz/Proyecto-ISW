import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getInventoryItems, getItemById, deleteItem } from '@/api/inventory';
import { Info, Search, ArrowUpDown, EllipsisVertical, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/helpers/dates';
import AddItemDialog from '@/components/inventory/dialog/AddItemDialog';
import ItemDetailsDialog from '@/components/inventory/dialog/ItemDetailsDialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import EditItemDialog from '@/components/inventory/dialog/EditItemDialog';
import { capitalize } from '@/helpers/capitalize';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const InventoryTable = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const fetchItems = async () => {
    try {
      const data = await getInventoryItems();
      console.log('Datos del inventario:', data);
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error al cargar items:', error);
    }
  };

  const fetchItemDetails = async (id) => {
    try {
      const item = await getItemById(id);
      setSelectedItem(item);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error al obtener el ítem:', error);
    }
  };

  const openConfirmationDialog = (id) => {
    setItemToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setItemToDelete(null);
    setIsConfirmationDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteItem(itemToDelete);
        setItems((prevItems) =>
          prevItems.filter((item) => item.id_item !== itemToDelete)
        );
        setFilteredItems((prevItems) =>
          prevItems.filter((item) => item.id_item !== itemToDelete)
        );
      } catch (error) {
        console.error('Error al eliminar el item:', error);
        alert('No se pudo eliminar el item.');
      } finally {
        closeConfirmationDialog();
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedItems = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    let filtered = items.filter((item) => {
      const matchesSearch = item.name_item.toLowerCase().includes(lowercasedSearch);
      const matchesCategory =
        selectedCategory === 'todas' || item.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  
    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        if (typeof a[sortConfig.key] === 'string') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        } else if (typeof a[sortConfig.key] === 'number') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
        return 0;
      });
    }
  
    return filtered;
  }, [items, search, selectedCategory, sortConfig]);

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-3">Productos</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="max-w-full"
          />
          <Search className="ml-2 h-5 w-5 text-gray-500" />
          <div className="ml-5">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="bicicletas">Bicicletas</SelectItem>
                <SelectItem value="repuestos">Repuestos</SelectItem>
                <SelectItem value="componentes">Componentes</SelectItem>
                <SelectItem value="herramientas">Herramientas</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
                <SelectItem value="equipamiento">Equipamiento</SelectItem>
                <SelectItem value="electrónica">Electrónica</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AddItemDialog fetchItems={fetchItems} />
      </div>

      <Card className="border-none pt-4">
        <CardContent>
          <div className="overflow-y-auto relative" style={{ maxHeight: '520px' }}>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name_item')}
                      className="text-foreground"
                    >
                      <strong>Nombre</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('category')}
                      className="text-foreground"
                    >
                      <strong>Categoría</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('selling_price')}
                      className="text-foreground"
                    >
                      <strong>Precio Venta</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('stock')}
                      className="text-foreground"
                    >
                      <strong>Stock</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('rut_supplier')}
                      className="text-foreground"
                    >
                      <strong>Proveedor</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('created_at')}
                      className="text-foreground"
                    >
                      <strong>Registrado</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <strong className="text-foreground">Acciones</strong>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedItems.map((item) => (
                  <TableRow key={item.id_item}>
                    <TableCell>{item.name_item}</TableCell>
                    <TableCell>{capitalize(item.category)}</TableCell>
                    <TableCell>$ {item.selling_price?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      {item.suppliers && item.suppliers.length > 0 ? (
                        (() => {
                          // Filtrar duplicados usando un conjunto (Set)
                          const uniqueSuppliers = [...new Set(item.suppliers)];
                          // Renderizar el primer proveedor y el contador de adicionales
                          return (
                            <>
                              {uniqueSuppliers[0] || 'No Registrado'}
                              {uniqueSuppliers.length > 1 && (
                                <span className="inline-block ml-1.5 px-2 py-1 bg-background text-gray-500 dark:text-gray-300 text-xs font-semibold rounded">
                                  +{uniqueSuppliers.length - 1}
                                </span>
                              )}
                            </>
                          );
                        })()
                      ) : (
                        'No Registrado'
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(item.created_at)}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 hover:bg-gray-100 rounded-md"
                          >
                            <EllipsisVertical className="h-5 w-5 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border rounded-md shadow-lg z-50 w-48">
                          <DropdownMenuItem
                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-gray-700"
                            onClick={() => fetchItemDetails(item.id_item)}
                          >
                            Ver información
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-gray-700"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-600"
                            onClick={() => openConfirmationDialog(item.id_item)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ItemDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        item={selectedItem}
        onUpdateItem={fetchItems}
      />

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        handleClose={closeConfirmationDialog}
        handleConfirm={handleConfirmDelete}
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        item={selectedItem}
        onUpdateItem={fetchItems}
      />
    </div>
  );
};

export default InventoryTable;
