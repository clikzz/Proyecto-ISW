import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import AllTransactions from "./AllTransactions";
import { deleteTransaction } from "@/api/transaction";
import { ModifyTransactionDialog } from "./dialog/ModifyTransactionDialog";
import { useAlert } from "@context/alertContext";
import { getServices } from "@/api/service";
import { formatDate } from "@/helpers/dates";
import { capitalize } from "@/helpers/capitalize";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function TransactionSummary({
  transactions,
  onTransactionUpdated,
}) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [modalViewMoreOpen, setModalViewMoreOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { showAlert } = useAlert();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const services = await getServices();

        const formattedTransactions = transactions
          .filter((transaction) => !transaction.is_deleted)
          .map((transaction) => ({
            ...transaction,
            type: transaction.transaction_type,
          }));

        const formattedServices = services
          .filter((service) => !service.is_deleted)
          .map((service) => ({
            ...service,
            id: service.id_service,
            transaction_type: "servicio",
            description: service.name_service,
            amount: service.price_service,
            payment_method: service.payment_method_service,
            transaction_date: service.created_at,
          }));

        const allTransactions = [
          ...formattedTransactions,
          ...formattedServices,
        ];

        allTransactions.sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        );

        setAllTransactions(allTransactions);
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
        showAlert("Error al cargar las transacciones", "error");
      }
    };

    fetchAllTransactions();
  }, [transactions, showAlert]);

  const handleDelete = (id, transaction_type) => {
    console.log("Attempting to delete transaction:", { id, transaction_type });

    setTransactionToDelete({ id, transaction_type });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete.id);
        onTransactionUpdated();
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
    setEditingTransaction(transaction);
  };

  return (
    <>
      <Card className="bg-background border-none rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Resumen de Transacciones
          </h3>
          <div className="space-y-4">
            {allTransactions.slice(0, 4).map((t) => (
              <motion.div
                key={t.id_transaction || t.id}
                className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(t.transaction_date)} -{" "}
                    {capitalize(t.transaction_type)} -{" "}
                    {capitalize(t.payment_method)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-lg font-semibold ${
                      t.transaction_type === "ingreso" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "servicio"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {t.transaction_type === "ingreso" ||
                    t.type === "venta" ||
                    t.transaction_type === "servicio"
                      ? "+"
                      : "-"}
                    ${t.amount?.toLocaleString('es-CL')}
                  </div>
                  <button
                    onClick={() => handleEdit(t)}
                    className={`text-blue-500 hover:text-blue-700 ${
                      t.transaction_type === "servicio" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "compra"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      t.transaction_type === "servicio" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "compra"
                    }
                    title={
                      t.transaction_type === "servicio" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "compra"
                        ? "No se puede modificar porque está asociado a un servicio/venta/compra"
                        : ""
                    }
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(t.id_transaction || t.id, t.transaction_type)
                    }
                    className={`text-red-500 hover:text-red-700 ${
                      t.transaction_type === "servicio" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "compra"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      t.transaction_type === "servicio" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "compra"
                    }
                    title={
                      t.transaction_type === "servicio" ||
                      t.transaction_type === "venta" ||
                      t.transaction_type === "compra"
                        ? "No se puede modificar porque la transacción está asociado a un servicio/venta/compra"
                        : ""
                    }
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="flex justify-center">
              <button
                onClick={() => setModalViewMoreOpen(true)}
                className="hover:underline"
              >
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
        <ModifyTransactionDialog
          isOpen={true}
          onClose={() => setEditingTransaction(null)}
          onTransactionUpdated={onTransactionUpdated}
          transaction={editingTransaction}
        />
      )}
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        handleClose={() => setIsConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
}
