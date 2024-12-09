import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/api/transaction';
import { getSales, getPurchases } from '@/api/inventory';
import { getServices } from '@/api/service';
import NewTransactionForm from './NewTransactionForm';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useAlert } from '@context/alertContext';


const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function AllTransactions({ isOpen, onClose, transactions, onTransactionUpdated }) {
  const [allTransactions, setAllTransactions] = useState([]);
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
          transaction_type: 'venta', // Cambiado de 'venta' a 'ingreso'
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

        setAllTransactions([
          ...formattedTransactions,
          ...formattedSales,
          ...formattedPurchases,
          ...formattedServices
        ]);
      } catch (error) {
        console.error('Error al cargar las transacciones:', error);
        showAlert('Error al cargar las transacciones', 'error');
      }
    };

    if (isOpen) {
      fetchAllTransactions();
    }
  }, [isOpen, transactions, showAlert]);

  const handleDelete = async (id, transaction_type) => {
    console.log('Attempting to delete transaction:', { id, transaction_type });

    // Permitir eliminar transacciones de tipo 'ingreso', 'egreso'
    if (transaction_type !== 'ingreso' && transaction_type !== 'egreso') {
      showAlert('Solo se pueden eliminar transacciones de tipo ingreso o egreso, las compras/ventas o servicios deben tratarse en sus secciones correspondientes.', 'warning');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        await deleteTransaction(id);
        setAllTransactions(prevTransactions =>
          prevTransactions.filter(t => t.id_transaction !== id && t.id !== id)
        );
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
    } else {
      setEditingTransaction(transaction);
    }
  };


  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Resumen de Transacciones", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    const tableColumn = ["Fecha", "Tipo", "Descripción", "Monto", "Método de Pago", "RUT"];
    const tableRows = allTransactions.map(t => [
      new Date(t.transaction_date).toLocaleDateString(),
      t.transaction_type,
      t.description,
      formatoPesoChileno(t.amount),
      t.payment_method,
      t.rut
    ]);

    doc.autoTable(tableColumn, tableRows, {
      startY: 25,
      margin: { top: 25, right: 15, bottom: 15, left: 15 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 25 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
      theme: 'grid',
      didDrawPage: function(data) {
        if (data.pageNumber > 1) {
          doc.setFontSize(16);
          doc.text("Resumen de Transacciones", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
        }
      }
    });
    doc.save("transacciones.pdf");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Todas las Transacciones</h3>
          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="mr-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="space-y-4 max-h-[35rem] overflow-y-auto">
          {allTransactions
            .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
            .map((t) => (
              <div
                key={t.id_transaction || t.id}
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
                  <div className={`text-lg font-semibold ${t.transaction_type === 'ingreso' || t.transaction_type === 'venta' || t.transaction_type === 'servicio' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.transaction_type === 'ingreso' || t.type === 'venta' ? '+' : '-'}
                    {formatoPesoChileno(t.amount)}
                  </div>
                  <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id_transaction || t.id, t.transaction_type)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {editingTransaction && (
        <NewTransactionForm
          isOpen={true}
          onClose={() => setEditingTransaction(null)}
          onTransactionAdded={onTransactionUpdated}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  );
}
