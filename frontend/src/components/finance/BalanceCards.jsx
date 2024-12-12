import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function BalanceCards({ transactions }) {
  const [summary, setSummary] = useState({ ingresos: 0, egresos: 0, ventas: 0, compras: 0, servicios: 0 });

  const fetchSummary = async () => {
    try {
      const ingresos = transactions
        .filter(t => !t.is_deleted && (t.transaction_type === 'ingreso' || t.transaction_type === 'venta' || t.transaction_type === 'servicio'))
        .reduce((total, t) => total + Number(t.amount || 0), 0);

      const egresos = transactions
        .filter(t => !t.is_deleted && (t.transaction_type === 'egreso' || t.transaction_type === 'compra'))
        .reduce((total, t) => total + Number(t.amount || 0), 0);

      setSummary({
        ingresos: ingresos,
        egresos: egresos,
        balance: ingresos - egresos
      });
    } catch (error) {
      console.error('Error al obtener el resumen:', error);
      setSummary({ ingresos: 0, egresos: 0, balance: 0 });
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [transactions]);

  const cards = [
    { title: 'Balance Total', value: summary.balance, icon: DollarSign },
    { title: 'Ingresos Totales', value: summary.ingresos, icon: TrendingUp, color: 'green' },
    { title: 'Egresos Totales', value: summary.egresos, icon: TrendingDown, color: 'red' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className="bg-background border-none rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between p-6">
            <div className="flex flex-col justify-between space-y-0">
              <h3 className="text-sm font-medium mb-2">{card.title}</h3>
              <div className={`text-2xl font-bold ${card.color ? `text-${card.color}-500` : ''}`}>
                {formatoPesoChileno(card.value)}
              </div>
              <p className="text-xs text-muted-foreground">
                {index === 0 ? 'Actualizado al momento' : `Total de ${card.title.toLowerCase()}`}
              </p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color ? `text-${card.color}-500` : 'text-muted-foreground'} ml-auto`} />
          </div>
        </Card>
      ))}
    </div>
  );
}
