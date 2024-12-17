import React, { useState, useEffect, useRef } from "react";
import { X, Edit, Trash2, Filter, FileText } from 'lucide-react';
import { deleteTransaction } from "@/api/transaction";
import { getServices } from "@/api/service";
import { useAlert } from "@context/alertContext";
import { formatDate } from "@/helpers/dates";
import { exportTransactionsToPDF } from "@/helpers/exportTransactions";
import { capitalize } from "@/helpers/capitalize";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { ModifyTransactionDialog } from "./dialog/ModifyTransactionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const modalRef = useRef(null);

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
            rut: service.rut_user,
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target) && event.target.classList.contains('modal-overlay')) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDelete = (id_transaction, transaction_type) => {
    setTransactionToDelete({ id_transaction, transaction_type });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete.id_transaction);
        setAllTransactions((prevTransactions) =>
          prevTransactions.filter(
            (t) => t.id_transaction !== transactionToDelete.id_transaction
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
    setEditingTransaction(transaction);
  };

  const filteredTransactions =
    filterType === "all"
      ? allTransactions
      : allTransactions.filter((t) => t.transaction_type === filterType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
      <div ref={modalRef} className="bg-background p-6 rounded-lg shadow-lg w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Todas las Transacciones</h3>
          <div className="flex gap-2">
            <div className="mr-4">
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value)}
              >
                <SelectTrigger>
                  <Filter className="h-6 w-6 mr-2" />
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="egreso">Egreso</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={(e) => {e.stopPropagation(); exportTransactionsToPDF(filteredTransactions)}}
              className="mr-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Descargar PDF
            </button>
            <button
              onClick={(e) => {e.stopPropagation(); onClose(e)}}
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
              >
                <div>
                  <p className="font-medium">{capitalize(t.description)}</p>
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
                    t.transaction_type === "venta" ||
                    t.transaction_type === "servicio"
                      ? "+"
                      : "-"}
                    ${t.amount?.toLocaleString('es-CL')}
                  </div>
                  <button
                    onClick={(e) => {e.stopPropagation(); handleEdit(t)}}
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
                    onClick={(e) => {e.stopPropagation(); handleDelete(t.id_transaction, t.transaction_type)}}
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
              </div>
            ))}
        </div>
      </div>

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
    </div>
  );
}

