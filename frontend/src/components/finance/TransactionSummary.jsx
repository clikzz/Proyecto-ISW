import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { motion } from "framer-motion";

const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function TransactionSummary({ transactions }) {
  const [modalViewMoreOpen, setModalViewMoreOpen] = useState(false);

  return (
    <>
      <Card className="bg-background border-none rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumen de Transacciones</h3>
          <div className="space-y-4">
            {transactions.slice(0, 4).map((t) => (
              <motion.div
              key={t.id_transaction}
              className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
                <div>
                  <p className="font-medium">
                    {t.transaction_type === 'ingreso' ? 'Ingreso' : 'Egreso'}: {t.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(t.transaction_date).toLocaleDateString()} - {t.payment_method === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                  </p>
                </div>
                <div className={`text-lg font-semibold ${t.transaction_type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                  {t.transaction_type === 'ingreso' ? '+' : '-'}{formatoPesoChileno(t.amount)}
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
                      {t.transaction_type === 'ingreso' ? 'Ingreso' : 'Egreso'}:{' '}
                      {t.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(t.transaction_date).toLocaleDateString()} -{' '}
                      {t.payment_method === 'efectivo'
                        ? 'Efectivo'
                        : 'Transferencia'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      RUT: {t.rut}
                    </p>
                  </div>
                  <div
                    className={`mr-8 text-lg font-semibold ${
                      t.transaction_type === 'ingreso'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {t.transaction_type === 'ingreso' ? '+' : '-'}
                    {formatoPesoChileno(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
