import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Charts({ summary, transactions }) {
  // Configuración del gráfico de barras
  const data = {
    labels: ['Ingresos', 'Egresos', 'Balance'],
    datasets: [
      {
        label: 'Monto',
        data: [summary.ingresos, summary.egresos, summary.balance],
        backgroundColor: [
          'rgba(152,251,152, 0.8)',
          'rgb(240,128,128)',
          'rgba(84, 153, 199, 1)',
        ],
      },
    ],
  };

  // Configuración del gráfico de líneas
  const lineData = (() => {
    // Ordenar las transacciones por fecha
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
    );

    return {
      labels: sortedTransactions.map((t) =>
        new Date(t.transaction_date).toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'Ingresos',
          data: sortedTransactions.map((t) =>
            t.transaction_type === 'ingreso' ? t.amount : null
          ),
          borderColor: 'rgb(152,251,152)',
          backgroundColor: 'rgb(152,251,152)',
          fill: false,
          spanGaps: true,
        },
        {
          label: 'Egresos',
          data: sortedTransactions.map((t) =>
            t.transaction_type === 'egreso' ? t.amount : null
          ),
          borderColor: 'rgba(240,128,128)',
          backgroundColor: 'rgba(240,128,128)',
          fill: false,
          spanGaps: true,
        },
      ],
    };
  })();

  return (
    <Card className="bg-background border-none rounded-lg shadow-sm relative overflow-hidden">
      <div className="p-6">
        <Carousel className="w-full relative">
          <CarouselContent>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de Balance</h3>
                  <Bar data={data} />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de Línea</h3>
                  <Line data={lineData} />
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className=" -left-4 flex items-center justify-center" variant="ghost" />
          <CarouselNext className="-right-4 flex items-center justify-center" variant="ghost" />
        </Carousel>
      </div>
    </Card>
  );
}