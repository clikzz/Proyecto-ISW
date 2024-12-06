import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getPurchases } from '@/api/inventory';
import { Info, Search, ArrowUpDown, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import AddPurchaseDialog from '@/components/inventory/dialog/AddPurchaseDialog';

const PurchasesTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [search, setSearch] = useState('');

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
                    <TableCell>{purchase.amount}</TableCell>
                    <TableCell>{capitalize(purchase.payment_method)}</TableCell>
                    <TableCell>{purchase.name_supplier || 'Desconocido'}</TableCell>
                    <TableCell>{formatDateTime(purchase.transaction_date)}</TableCell>
                    <TableCell>
                      <Button className="bg-blue-500 text-white mr-2">
                        <Info />
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchasesTable;