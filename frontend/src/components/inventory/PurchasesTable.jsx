import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getPurchases } from '@/api/inventory';
import { Filter, Search, ArrowUpDown, EllipsisVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import AddPurchaseDialog from '@/components/inventory/dialog/AddPurchaseDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { deletePurchase } from '@/api/inventory';
import EditPurchaseDialog from '@/components/inventory/dialog/EditPurchaseDialog';
import PurchaseDetailsDialog from '@/components/inventory/dialog/PurchaseDetailsDialog';
import { exportToExcel, exportToPDF } from '@/helpers/exportPurchases';
import ExportButtons from '@/components/inventory/ExportButtons';
import { useAlert } from '@/context/alertContext';
import { useAuth } from '@/context/authContext';

const PurchasesTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [purchaseToEdit, setPurchaseToEdit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { showAlert } = useAlert();
  const { role, loading } = useAuth();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const fetchPurchases = async () => {
    try {
      const data = await getPurchases();
      setPurchases(data);
      setFilteredPurchases(data);
    } catch (error) {
      console.error('Error al cargar las compras:', error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = purchases.filter((purchase) => {
      const matchesSearch = purchase.name_item?.toLowerCase().includes(lowercasedSearch) ?? false;
      const matchesCategory =
        selectedCategory === 'todas' || selectedCategory === '' || purchase.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPurchases(filtered);
  }, [search, purchases, selectedCategory]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const openConfirmationDialog = (purchaseId) => {
    setPurchaseToDelete(purchaseId);
    setIsConfirmationDialogOpen(true);
  };
  
  const closeConfirmationDialog = () => {
    setPurchaseToDelete(null);
    setIsConfirmationDialogOpen(false);
  };

  const openEditDialog = (purchase) => {
    setPurchaseToEdit(purchase);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setPurchaseToEdit(null);
    setIsEditDialogOpen(false);
  };

  const handleUpdatePurchase = async (updatedPurchase) => {
    await fetchPurchases();
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (purchaseToDelete) {
      try {
        console.log('ID de la compra a eliminar en el front:', purchaseToDelete);
        await deletePurchase(purchaseToDelete);
        await fetchPurchases();
        showAlert('Compra eliminada correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar la compra:', error);
        showAlert('Ocurrió un error al eliminar la compra', 'error');
      } finally {
        closeConfirmationDialog();
      }
    }
  };

  const sortedPurchases = useMemo(() => {
    const sortablePurchases = [...filteredPurchases];
    if (sortConfig.key !== null) {
      sortablePurchases.sort((a, b) => {
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
    return sortablePurchases;
  }, [filteredPurchases, sortConfig]);

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-3">Compras</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center max-w-l">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto..."
            className="max-w-full"
          />
          <Search className="ml-2 h-7 w-7 text-gray-500" />
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
            data={filteredPurchases}
            handleExportExcel={exportToExcel}
            handleExportPDF={exportToPDF}
          />
          <AddPurchaseDialog fetchPurchases={fetchPurchases} />
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
                {sortedPurchases.map((purchase) => (
                  <TableRow key={purchase.id_transaction}>
                    <TableCell>{purchase.name_item}</TableCell>
                    <TableCell>{capitalize(purchase.category)}</TableCell>
                    <TableCell>{purchase.quantity_item}</TableCell>
                    <TableCell>$ {purchase.amount?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{capitalize(purchase.payment_method)}</TableCell>
                    <TableCell>{purchase.name_supplier || 'Desconocido'}</TableCell>
                    <TableCell>{formatDateTime(purchase.transaction_date)}</TableCell>
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
                            onClick={() => handleViewDetails(purchase)}
                          >
                            Ver información
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-gray-700"
                            onClick={() => openEditDialog(purchase)}
                          >
                            Editar
                          </DropdownMenuItem>
                          {/* Botón de eliminar: visible solo si el rol es "admin" */}
                          {role === 'admin' && (
                            <DropdownMenuItem
                              className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-600"
                              onClick={() => openConfirmationDialog(purchase.id_transaction)}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          )}
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

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        handleClose={closeConfirmationDialog}
        handleConfirm={handleConfirmDelete}
      />

      <PurchaseDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        onEdit={openEditDialog}
        purchase={selectedPurchase}
      />

      {purchaseToEdit && (
        <EditPurchaseDialog
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          purchase={purchaseToEdit}
          onUpdatePurchase={handleUpdatePurchase}
        />
      )}
    </div>
  );
};

export default PurchasesTable;