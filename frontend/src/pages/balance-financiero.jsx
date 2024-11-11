"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Search,
  Upload,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import {
  getAllTransactions,
  createTransaction,
  getTransactionsSummary,
} from "../api/transaction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Función para formatear números a pesos chilenos
const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function BalanceFinanciero() {
  const [transactions, setTransactions] = useState([]);
  const [transaction_type, setTransactionType] = useState("ingreso");
  const [amount, setAmount] = useState("");
  const [payment_method, setPaymentMethod] = useState("efectivo");
  const [description, setDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalViewMoreOpen, setModalViewMoreOpen] = useState(false);
  const [summary, setSummary] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setError("Failed to fetch transactions");
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      console.log("Fetching summary...");
      const data = await getTransactionsSummary();
      if (data.message) {
        setError(data.message);
      } else {
        console.log("Summary fetched:", data);
        setSummary(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error al obtener el resumen:", error);
      setError("Error al obtener el resumen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = {
        transaction_type,
        amount: amount, // Asegúrate de que el monto sea un número
        payment_method,
        description,
      };
      console.log("Adding new transaction:", newTransaction);
      await createTransaction(newTransaction);
      await fetchTransactions();
      await fetchSummary();
      setAmount("");
      setPaymentMethod("efectivo");
      setDescription("");
      setError(null);
      setModalOpen(false); // Cierra el modal después de agregar la transacción
    } catch (error) {
      console.error("Error al agregar la transacción:", error);
      setError("Error al agregar la transacción");
    }
  };

  const data = {
    labels: ["Ingresos", "Egresos", "Balance"],
    datasets: [
      {
        label: "Monto",
        data: [summary.ingresos, summary.egresos, summary.balance],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Balance Financiero
          </h1>
          <p className="text-3xl font-semibold">Taller de Bicicletas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar transacciones"
              className="w-[250px] pl-8 py-2 border rounded bg-background text-foreground"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            onClick={() => setModalOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Nueva Transacción
          </button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Cargando...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-background border-none rounded-lg shadow-sm">
              <div className="flex flex-row items-center justify-between p-6">
                <div className="flex flex-col justify-between space-y-0">
                  <h3 className="text-sm font-medium mb-2">Balance Total</h3>
                  <div className="text-2xl font-bold">
                    {formatoPesoChileno(summary.balance)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Actualizado al momento
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground ml-auto" />
              </div>
            </Card>
            <Card className="bg-background border-none rounded-lg shadow-sm">
              <div className="flex flex-row items-center justify-between p-6">
                <div className="flex flex-col justify-between space-y-0">
                  <h3 className="text-sm font-medium mb-2">Ingresos Totales</h3>
                  <div className="text-2xl font-bold text-green-500">
                    {formatoPesoChileno(summary.ingresos)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de ingresos
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 ml-auto" />
              </div>
            </Card>
            <Card className="bg-background border-none rounded-lg shadow-sm">
              <div className="flex flex-row items-center justify-between p-6">
                <div className="flex flex-col justify-between space-y-0">
                  <h3 className="text-sm font-medium mb-2">Egresos Totales</h3>
                  <div className="text-2xl font-bold text-red-500">
                    {formatoPesoChileno(summary.egresos)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de egresos
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500 ml-auto" />
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-background border-none rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Resumen de Transacciones
                </h3>
                <div className="space-y-4">
                  {transactions.slice(0, 4).map((t) => (
                    <div
                      key={t.id_transaction}
                      className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-medium">
                          {t.transaction_type === "ingreso" ? "Ingreso" : "Egreso"}:{" "}
                          {t.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(t.transaction_date).toLocaleDateString()} -{" "}
                          {t.payment_method === "efectivo" ? "Efectivo" : "Transferencia"}
                        </p>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          t.transaction_type === "ingreso"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {t.transaction_type === "ingreso" ? "+" : "-"}
                        {formatoPesoChileno(t.amount)}
                      </div>
                    </div>
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

            <div className="bg-background border-none rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Gráfico de Balance
                </h3>
                <Bar data={data} />
              </div>
            </div>
          </div>
        </>
      )}
      {modalViewMoreOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Todas las Transacciones</h3>
              <button
                onClick={() => setModalViewMoreOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 max-h-[35rem] overflow-y-auto">
              {transactions.map((t) => (
                <div
                  key={t.id_transaction}
                  className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {t.transaction_type === "ingreso" ? "Ingreso" : "Egreso"}:{" "}
                      {t.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(t.transaction_date).toLocaleDateString()} - {t.payment_method === "efectivo" ? "Efectivo" : "Transferencia"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      RUT: {t.rut}
                    </p>
                  </div>
                  <div
                    className={`mr-8 text-lg font-semibold ${
                      t.transaction_type === "ingreso" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {t.transaction_type === "ingreso" ? "+" : "-"}
                    {formatoPesoChileno(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Agregar Nueva Transacción
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={addTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="transaction_type"
                    className="block text-sm font-medium text-foreground"
                  >
                    Tipo de Transacción
                  </label>
                  <select
                    id="transaction_type"
                    value={transaction_type}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-foreground"
                  >
                    Monto
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="payment_method"
                  className="block text-sm font-medium text-foreground"
                >
                  Método de Pago
                </label>
                <select
                  id="payment_method"
                  value={payment_method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground"
                >
                  Descripción
                </label>
                <input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              >
                Agregar Transacción
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
