import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from "framer-motion";
import { Edit, Trash2 } from 'lucide-react';
import AllTransactions from './AllTransactions';
import { deleteTransaction } from '@/api/transaction';
import NewTransactionForm from './NewTransactionForm';
import { useAlert } from '@context/alertContext';
import { getSales, getPurchases } from '@/api/inventory';
import { getServices } from '@/api/service';

const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function TransactionSummary({ transactions, onTransactionUpdated }) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [modalViewMoreOpen, setModalViewMoreOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const sales = await getSales();
        const purchases = await getPurchases();
        const services = await getServices();

        const formattedTransactions = transactions
          .filter(transaction => transaction.transaction_type === 'ingreso' || transaction.transaction_type === 'egreso')
          .map(transaction => ({
            ...transaction,
            type: transaction.transaction_type
          }));

        const formattedSales = sales.map(sale => ({
          ...sale,
          transaction_type: 'venta',
          description: `${sale.name_item}`
        }));

        const formattedPurchases = purchases.map(purchase => ({
          ...purchase,
          transaction_type: 'compra',
          description: `${purchase.name_item}`,
        }));

        const formattedServices = services.map(service => ({
          ...service,
          transaction_type: 'servicio',
          description: `${service.name_service}`,
          type: 'servicio',
          amount: service.price_service,
          payment_method: service.payment_method_service
        }));

        const allTransactions = [
          ...formattedTransactions,
          ...formattedSales,
          ...formattedPurchases,
          ...formattedServices
        ];

        allTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

        setAllTransactions(allTransactions);
      } catch (error) {
        console.error('Error al cargar las transacciones:', error);
        showAlert('Error al cargar las transacciones', 'error');
      }
    };

    fetchAllTransactions();
  }, [transactions, showAlert]);

  const handleDelete = async (id, transaction_type) => {
    console.log('Attempting to delete transaction:', { id, transaction_type });

    if (transaction_type !== 'ingreso' && transaction_type !== 'egreso') {
      showAlert('Solo se pueden eliminar transacciones de tipo ingreso o egreso, las compras/ventas o servicios deben tratarse en sus secciones correspondientes.', 'warning');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        await deleteTransaction(id);
        onTransactionUpdated();
        showAlert('Transacción eliminada con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar la transacción:', error);
        showAlert('Error al eliminar la transacción', 'error');
      }
    }
  };

  const handleEdit = (transaction) => {
    console.log('Attempting to edit transaction:', transaction);
    if (transaction.transaction_type !== 'ingreso' && transaction.transaction_type !== 'egreso') {
      showAlert('Solo se pueden modificar transacciones de tipo ingreso o egreso, las compras/ventas o servicios deben tratarse en sus secciones correspondientes.', 'warning');
      return;
    }
    setEditingTransaction(transaction);
  };

  const getTransactionColor = (type) => {
    if (['ingreso', 'venta', 'servicio'].includes(type)) {
      return 'text-green-500';
    } else if (['egreso', 'compra'].includes(type)) {
      return 'text-red-500';
    }
    return 'text-gray-500'; // default color for unknown types
  };

  return (
    <>
      <Card className="bg-background border-none rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumen de Transacciones</h3>
          <div className="space-y-4">
            {allTransactions.slice(0, 4).map((t) => (
              <motion.div
                key={t.id_transaction || t.id || t.id_sale || t.id_purchase || t.id_service} // Added fallback keys
                className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div>
                  <p className="font-medium">
                    {t.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(t.transaction_date).toLocaleDateString()} - {t.transaction_type} - {t.payment_method}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-semibold ${getTransactionColor(t.transaction_type)}`}>
                    {['ingreso', 'venta', 'servicio'].includes(t.transaction_type) ? '+' : '-'}
                    {formatoPesoChileno(t.amount)}
                  </div>
                  <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(t.id_transaction || t.id || t.id_sale || t.id_purchase || t.id_service, t.transaction_type)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="flex justify-center">
              <button onClick={() => setModalViewMoreOpen(true)} className="hover:underline">
                Ver más...
              </button>
            </div>
          </div>
        </div>
      </Card>

      <AllTransactions
        isOpen={modalViewMoreOpen}
        onClose={() => setModalViewMoreOpen(false)}
        transactions={allTransactions}
        onTransactionUpdated={onTransactionUpdated}
      />

      {editingTransaction && (
        <NewTransactionForm
          isOpen={true}
          onClose={() => setEditingTransaction(null)}
          onTransactionAdded={onTransactionUpdated}
          editingTransaction={editingTransaction}
        />
      )}
    </>
  );
}
