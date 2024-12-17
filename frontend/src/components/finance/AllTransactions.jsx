import React, { useState, useEffect } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { deleteTransaction } from "@/api/transaction";
import { getServices } from "@/api/service";
import NewTransactionForm from "./NewTransactionForm";
import { useAlert } from "@context/alertContext";
import { formatDate } from "@/helpers/dates";
import { exportTransactionsToPDF } from "@/helpers/exportTransactions";
import { capitalize } from '@/helpers/capitalize';
import ConfirmationDialog from "@/components/ConfirmationDialog";

const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function AllTransactions({
  isOpen,
  onClose,
  transactions,
  onTransactionUpdated,
}) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { showAlert } = useAlert();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const services = await getServices();

        const formattedTransactions = transactions
          .filter(
            (transaction) =>
              !transaction.is_deleted &&
              (transaction.transaction_type === "ingreso" ||
                transaction.transaction_type === "egreso" ||
                transaction.transaction_type === "venta" ||
                transaction.transaction_type === "compra")
          )
          .map((transaction) => ({
            ...transaction,
            type: transaction.transaction_type,
          }));
        console.log(formattedTransactions);

        const formattedServices = services
          .filter((service) => !service.is_deleted)
          .map((service) => ({
            ...service,
            id_transaction: service.id_service,
            transaction_type: "servicio",
            description: service.name_service,
            type: "servicio",
            amount: service.price_service,
            payment_method: service.payment_method_service,
            transaction_date: service.created_at,
            rut: service.rut_user
          }));

        setAllTransactions([...formattedTransactions, ...formattedServices]);
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
        showAlert("Error al cargar las transacciones", "error");
      }
    };

    if (isOpen) {
      fetchAllTransactions();
    }
  }, [isOpen, transactions, showAlert]);

  const handleDelete = (id_transaction, transaction_type) => {
    console.log("Attempting to delete transaction:", { id_transaction, transaction_type });

    if (transaction_type === "ingreso" && transaction_type === "egreso") {
      setTransactionToDelete({ id, transaction_type });
      setIsConfirmDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete.id);
        setAllTransactions((prevTransactions) =>
          prevTransactions.filter(
            (t) =>
              t.id_transaction !== transactionToDelete.id
          )
        );
        showAlert("Transacción eliminada con éxito", "success");
      } catch (error) {
        console.error("Error al eliminar la transacción:", error);
        showAlert("Error al eliminar la transacción", "error");
      }
    }
    setIsConfirmDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleEdit = (transaction) => {
    console.log("Attempting to edit transaction:", transaction);
    if (
      transaction.transaction_type === "ingreso" ||
      transaction.transaction_type === "egreso"
    ) {
      setEditingTransaction(transaction);
    }
  };

  const filteredTransactions =
    filterType === "all"
      ? allTransactions
      : allTransactions.filter((t) => t.transaction_type === filterType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Todas las Transacciones</h3>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="mr-4 px-4 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
              <option value="venta">Venta</option>
              <option value="compra">Compra</option>
              <option value="servicio">Servicio</option>
            </select>
            <button
              onClick={() => exportTransactionsToPDF(filteredTransactions)}
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
          {filteredTransactions
            .sort(
              (a, b) =>
                new Date(b.transaction_date) - new Date(a.transaction_date)
            )
            .map((t) => (
              <div
                key={t.id_transaction}
                className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div>
                  <p className="font-medium">{capitalize(t.description)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(t.transaction_date)} - {capitalize(t.transaction_type)} - {capitalize(t.payment_method)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-lg font-semibold ${t.transaction_type === "ingreso" ||t.transaction_type === "venta" || t.transaction_type === "servicio" ? "text-green-500" : "text-red-500"}`}
                  >
                    {t.transaction_type === "ingreso" || t.transaction_type === "venta" || t.transaction_type === "servicio"
                      ? "+"
                      : "-"}
                    {formatoPesoChileno(t.amount)}
                  </div>
                  <button
                    onClick={() => handleEdit(t)}
                    className={`text-blue-500 hover:text-blue-700 ${t.transaction_type === 'servicio' || t.transaction_type === 'venta' || t.transaction_type === 'compra' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={t.transaction_type === 'servicio' || t.transaction_type === 'venta' || t.transaction_type === 'compra'}
                    title={t.transaction_type === 'servicio' || t.transaction_type === 'venta' || t.transaction_type === 'compra' ? 'No se puede modificar porque está asociado a un servicio/venta/compra' : ''}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id_transaction, t.transaction_type)}
                    className={`text-red-500 hover:text-red-700 ${t.transaction_type === 'servicio' || t.transaction_type === 'venta' || t.transaction_type === 'compra' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={t.transaction_type === 'servicio' || t.transaction_type === 'venta' || t.transaction_type === 'compra'}
                    title={t.transaction_type === 'servicio' || t.transaction_type === 'venta' || t.transaction_type === 'compra' ? 'No se puede modificar porque la transacción está asociado a un servicio/venta/compra' : ''}
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
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        handleClose={() => setIsConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
      />
    </div>
  );
}
