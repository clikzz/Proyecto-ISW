'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  getAllTransactions,
  createTransaction,
  getTransactionsSummary,
} from '../api/transaction';

import BalanceCards from '@/components/BalanceCards';
import TransactionSummary from '@/components/TransactionSummary';
import Charts from '@/components/Charts';
import NewTransactionForm from '@/components/NewTransactionForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function BalanceFinanciero() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ ingresos: 0, egresos: 0, balance: 0 });

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await getTransactionsSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error al obtener el resumen:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const addTransaction = async (newTransaction) => {
    try {
      await createTransaction(newTransaction);
      await fetchTransactions();
      await fetchSummary();
    } catch (error) {
      console.error('Error al agregar la transacción:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Balance Financiero</h1>
          <p className="text-3xl font-semibold">Taller de Bicicletas</p>
        </div>
        <NewTransactionForm onSubmit={addTransaction} />
      </div>

      <BalanceCards summary={summary} />
      <div className="grid gap-6 md:grid-cols-2">
        <TransactionSummary transactions={transactions} />
        <Charts summary={summary} transactions={transactions} />
      </div>
    </div>
  );
}
