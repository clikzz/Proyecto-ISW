'use client';

import React, { useState, useEffect } from 'react';
import { getAllTransactions, getTransactionsSummary } from '../api/transaction';
import BalanceCards from '@/components/finance/BalanceCards';
import TransactionSummary from '@/components/finance/TransactionSummary';
import Charts from '@/components/finance/Charts';
import NewTransactionForm from '@/components/finance/NewTransactionForm';
import AllTransactions from '@/components/finance/AllTransactions';

export default function Finanzas() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });
  const [isNewTransactionFormOpen, setIsNewTransactionFormOpen] = useState(false);
  const [isAllTransactionsOpen, setIsAllTransactionsOpen] = useState(false);

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

  const handleTransactionUpdated = () => {
    fetchTransactions();
    fetchSummary();
  };

  return (
    <div className="container mx-auto flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Balance Financiero
          </h1>
          <p className="text-3xl font-semibold">Taller de Bicicletas</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          onClick={() => setIsNewTransactionFormOpen(true)}
        >
          Agregar Movimiento
        </button>
      </div>

      <BalanceCards transactions={transactions} />
      <div className="grid gap-6 md:grid-cols-2">
        <TransactionSummary
          transactions={transactions}
          onTransactionUpdated={handleTransactionUpdated}
        />
        <Charts summary={summary} transactions={transactions} />
      </div>

      <NewTransactionForm
        isOpen={isNewTransactionFormOpen}
        onClose={() => setIsNewTransactionFormOpen(false)}
        onTransactionAdded={handleTransactionUpdated}
      />

      <AllTransactions
        isOpen={isAllTransactionsOpen}
        onClose={() => setIsAllTransactionsOpen(false)}
        transactions={transactions}
        onTransactionUpdated={handleTransactionUpdated}
      />
    </div>
  );
}
