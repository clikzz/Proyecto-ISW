import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getSales } from '@/api/inventory';
import { Filter, Search, ArrowUpDown, EllipsisVertical } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import SellItemDialog from '@/components/inventory/dialog/SellItemDialog';
import EditSaleDialog from '@/components/inventory/dialog/EditSaleDialog';
import SaleDetailsDialog from '@/components/inventory/dialog/SaleDetailsDialog';
import { deleteSale } from '@/api/inventory';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAlert } from '@/context/alertContext';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { exportToExcel, exportToPDF } from '@/helpers/exportSales';
import ExportButtons from '@/components/inventory/ExportButtons';

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [search, setSearch] = useState('');
  const [isEditSaleDialogOpen, setIsEditSaleDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const { showAlert } = useAlert();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const fetchSales = async () => {
    try {
      const data = await getSales();
      console.log('Ventas:', data);
      setSales(data);
      setFilteredSales(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = sales.filter((sale) => {
      const matchesSearch = sale.name_item.toLowerCase().includes(lowercasedSearch);
      const matchesCategory =
        selectedCategory === 'todas' || sale.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredSales(filtered);
  }, [search, sales, selectedCategory]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleConfirmDelete = async () => {
    if (saleToDelete) {
      try {
        await deleteSale(saleToDelete);
        await fetchSales();
        showAlert('Venta eliminada exitosamente', 'success');
      } catch (error) {
        console.error('Error al eliminar la venta:', error);
        showAlert('Error al eliminar la venta', 'error');
      } finally {
        closeConfirmationDialog();
      }
    }
  };

  const openConfirmationDialog = (saleId) => {
    setSaleToDelete(saleId);
    setIsConfirmationDialogOpen(true);
  };
  
  const closeConfirmationDialog = () => {
    setSaleToDelete(null);
    setIsConfirmationDialogOpen(false);
  };

  // Función para abrir el diálogo de edición (desde cualquier parte)
  const openEditSaleDialog = (sale) => {
    setSelectedSale(sale);
    setIsEditSaleDialogOpen(true);
    setIsDetailsDialogOpen(false); // Cierra el diálogo de detalles
  };
  
  const closeEditSaleDialog = () => {
    setSelectedSale(null);
    setIsEditSaleDialogOpen(false);
  };

  const openDetailsDialog = (sale) => {
    setSelectedSale(sale);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setSelectedSale(null);
    setIsDetailsDialogOpen(false);
  };
  
  // Función para actualizar ventas después de edición
  const handleUpdateSale = async () => {
    await fetchSales();
    closeEditSaleDialog();
  };

  const sortedSales = useMemo(() => {
    const sortableSales = [...filteredSales];
    if (sortConfig.key !== null) {
      sortableSales.sort((a, b) => {
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
    return sortableSales;
  }, [filteredSales, sortConfig]);

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-3">Ventas</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto..."
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
        <div className="flex gap-2">
          <ExportButtons
            data={filteredSales}
            handleExportExcel={exportToExcel}
            handleExportPDF={exportToPDF}
          />
          <SellItemDialog fetchSales={fetchSales} />
        </div>
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
                      <strong>Producto</strong>
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
                      onClick={() => handleSort('quantity_item')}
                      className="text-foreground"
                    >
                      <strong>Cantidad</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('amount')}
                      className="text-foreground"
                    >
                      <strong>Monto</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('payment_method')}
                      className="text-foreground"
                    >
                      <strong>Método de Pago</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('transaction_date')}
                      className="text-foreground"
                    >
                      <strong>Fecha</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <strong className="text-foreground">Acciones</strong>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSales.map((sale) => (
                  <TableRow key={sale.id_transaction}>
                    <TableCell>{sale.name_item}</TableCell>
                    <TableCell>{capitalize(sale.category)}</TableCell>
                    <TableCell>{sale.quantity_item}</TableCell>
                    <TableCell>$ {sale.amount?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{capitalize(sale.payment_method)}</TableCell>
                    <TableCell>{formatDateTime(sale.transaction_date)}</TableCell>
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
                            onClick={() => openDetailsDialog(sale)}
                          >
                            Ver información
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-gray-700"
                            onClick={() => openEditSaleDialog(sale)}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-600"
                            onClick={() => openConfirmationDialog(sale.id_transaction)}
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

      <EditSaleDialog
        isOpen={isEditSaleDialogOpen}
        onClose={closeEditSaleDialog}
        sale={selectedSale}
        onUpdateSale={handleUpdateSale}
      />

      <SaleDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        onEdit={openEditSaleDialog}
        sale={selectedSale}
      />

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        handleClose={closeConfirmationDialog}
        handleConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SalesTable;