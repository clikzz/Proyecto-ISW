import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getPurchases } from '@/api/inventory';
import { Info, Search, ArrowUpDown, EllipsisVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import AddPurchaseDialog from '@/components/inventory/dialog/AddPurchaseDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { deletePurchase } from '@/api/inventory';
import EditPurchaseDialog from '@/components/inventory/dialog/EditPurchaseDialog';
import { useAlert } from '@/context/alertContext';

const PurchasesTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [purchaseToEdit, setPurchaseToEdit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { showAlert } = useAlert();

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
      const description = purchase.name_item || '';
      return description.toLowerCase().includes(lowercasedSearch);
    });
    setFilteredPurchases(filtered);
  }, [search, purchases]);

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

  const handleConfirmDelete = async () => {
    if (purchaseToDelete) {
      try {
        console.log('ID de la compra a eliminar en el front:', purchaseToDelete);
        await deletePurchase(purchaseToDelete);
        await fetchPurchases(); // Refresca la lista de compras
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
        <div className="flex items-center max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto..."
            className="max-w-full"
          />
          <Search className="ml-2 h-5 w-5 text-gray-500" />
        </div>
        <AddPurchaseDialog fetchPurchases={fetchPurchases} />
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
                          >
                            Ver información
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-gray-700"
                            onClick={() => openEditDialog(purchase)}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-600"
                            onClick={() => openConfirmationDialog(purchase.id_transaction)}
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

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        handleClose={closeConfirmationDialog}
        handleConfirm={handleConfirmDelete}
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