import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts({ summary, transactions }) {
  const { theme } = useTheme();

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

  // Configuración del gráfico de torta
  const tortinhaData = {
    labels: ['Ingresos Totales', 'Egresos Totales'],
    datasets: [
      {
        data: [summary.ingresos, summary.egresos],
        backgroundColor: ['rgba(152,251,152, 0.8)', 'rgb(240,128,128)'],
        hoverBackgroundColor: ['rgba(152,251,152, 1)', 'rgb(240,128,128, 1)'],
      },
    ],
  };
  // Configuración de opciones del gráfico
  const options = {
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? 'white' : 'gray',
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: theme === 'dark' ? 'white' : 'gray',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear',
        ticks: {
          color: theme === 'dark' ? 'white' : 'gray',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <Card className="bg-background border-none rounded-lg shadow-sm relative overflow-hidden">
      <div className="p-6">
        <Carousel className="w-full relative">
          <CarouselContent>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de Balance</h3>
                  <Bar data={data} options={options}/>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de Línea</h3>
                  <Line data={lineData} options={options}/>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de Torta</h3>
                  <Pie data={tortinhaData} options={options}/>
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
