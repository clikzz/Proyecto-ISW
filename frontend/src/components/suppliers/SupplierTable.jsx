import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, Search, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { getSuppliers, deleteSupplier } from '@api/suppliers';
import ConfirmationDialog from '@components/ConfirmationDialog';
import AddSupplierDialog from '@/components/suppliers/AddSupplierDialog';
import ModifySupplierDialog from '@/components/suppliers/ModifySupplierDialog';
import ExportButtons from './ExportButtons';

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [ModDialogOpen, setModDialogOpen] = useState(false);
  const [supplierToModify, setSupplierToModify] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const handleDeleteClick = (rut) => {
    setSupplierToDelete(rut);
    setDialogOpen(true);
  };

  const handleModifyClick = (supplier) => {
    setSupplierToModify(supplier);
    setModDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchSuppliers();
  };

  const handleCloseConfirmationDialog = () => {
    setDialogOpen(false);
  };

  const fetchSuppliers = async () => {
    try {
      const suppliers = await getSuppliers();
      setSuppliers(suppliers);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier(supplierToDelete);
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    } finally {
      setDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const sortedSuppliers = useMemo(() => {
    let sortableSuppliers = [...suppliers];
    if (sortConfig.key !== null) {
      sortableSuppliers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSuppliers;
  }, [suppliers, sortConfig]);

  const filteredSuppliers = sortedSuppliers.filter((supplier) =>
    supplier.name_supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 text-foreground relative">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Search className="ml-2 h-4 w-4" />
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons suppliers={filteredSuppliers} />
          <AddSupplierDialog fetchSuppliers={fetchSuppliers} />
        </div>
      </div>
      <Card className="border-none pt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('rut_supplier')}
                    className="text-foreground"
                  >
                    <strong>RUT</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name_supplier')}
                    className="text-foreground"
                  >
                    <strong>Nombre</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('phone_supplier')}
                    className="text-foreground"
                  >
                    <strong>Teléfono</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email_supplier')}
                    className="text-foreground"
                  >
                    <strong>Correo</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('address_supplier')}
                    className="text-foreground"
                  >
                    <strong>Dirección</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <strong className="text-foreground">Acciones</strong>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.rut_supplier}>
                  <TableCell>{supplier.rut_supplier}</TableCell>
                  <TableCell>{supplier.name_supplier}</TableCell>
                  <TableCell>{supplier.phone_supplier}</TableCell>
                  <TableCell>{supplier.email_supplier}</TableCell>
                  <TableCell>{supplier.address_supplier}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleModifyClick(supplier)}>
                      <Edit />
                    </Button>
                    <Button
                      className="ml-2 bg-red-500 hover:bg-red-600 p-1"
                      onClick={() => handleDeleteClick(supplier.rut_supplier)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {ModDialogOpen && (
        <ModifySupplierDialog
          isOpen={ModDialogOpen}
          onClose={() => setModDialogOpen(false)}
          supplier={supplierToModify}
          fetchSuppliers={fetchSuppliers}
        />
      )}
      <ConfirmationDialog
        open={DialogOpen}
        handleClose={handleCloseConfirmationDialog}
        handleConfirm={handleConfirmDelete}
        className="bg-background text-foreground"
      />
    </div>
  );
}
