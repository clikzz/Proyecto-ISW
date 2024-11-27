import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { createTransaction } from '@/api/transaction';

export default function NewTransactionForm({ onTransactionAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transaction_type, setTransactionType] = useState('ingreso');
  const [amount, setAmount] = useState('');
  const [payment_method, setPaymentMethod] = useState('efectivo');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = { transaction_type, amount, payment_method, description };
      await createTransaction(newTransaction);
      onTransactionAdded();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al agregar la transacción:', error);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
      >
        <Upload className="h-4 w-4" />
        Agregar Movimiento
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Agrega un Movimiento</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="transaction_type" className="block text-sm font-medium text-foreground">
                Tipo de Movimiento
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
              <label htmlFor="amount" className="block text-sm font-medium text-foreground">
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
            <label htmlFor="payment_method" className="block text-sm font-medium text-foreground">
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
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
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
            Agregar Movimiento
          </button>
        </form>
      </div>
    </div>
  );
}