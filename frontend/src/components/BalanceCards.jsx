import React from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

export default function BalanceCards({ summary }) {
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
