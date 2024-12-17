import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { getServices } from '@/api/service';

export default function BalanceCards({ transactions }) {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const services = await getServices();
      setServices(services);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const summary = useMemo(() => {
    const formattedTransactions = transactions
      .filter(transaction => !transaction.is_deleted)
      .map(transaction => ({
        ...transaction,
        type: transaction.transaction_type
      }));

    const formattedServices = services
      .filter(service => !service.is_deleted)
      .map(service => ({
        ...service,
        transaction_type: 'servicio',
        type: 'servicio',
        amount: service.price_service
      }));

    const combinedData = [
      ...formattedTransactions,
      ...formattedServices
    ];

    const ingresos = combinedData
      .filter(t => t.transaction_type === 'ingreso' || t.transaction_type === 'venta' || t.transaction_type === 'servicio')
      .reduce((total, t) => total + Number(t.amount || 0), 0);

    const egresos = combinedData
      .filter(t => t.transaction_type === 'egreso' || t.transaction_type === 'compra')
      .reduce((total, t) => total + Number(t.amount || 0), 0);

    return {
      ingresos: ingresos,
      egresos: egresos,
      balance: ingresos - egresos
    };
  }, [transactions, services]);

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
                ${card.value?.toLocaleString('es-CL')}
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
