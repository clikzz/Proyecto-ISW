import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { getTransactionsSummary } from '@/api/transaction';
import { getSales } from '@/api/inventory';
import { getServices } from '@/api/service';
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
} from "chart.js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

export default function Charts({ transactions }) {
  const { theme } = useTheme();
  const [summary, setSummary] = useState({ ingresos: 0, egresos: 0, ventas: 0, compras: 0, servicios: 0 });

  const fetchSummary = async () => {
    try {
      const [transactionData, salesData, servicesData] = await Promise.all([
        getTransactionsSummary(),
        getSales(),
        getServices()
      ]);

      const ventasTotal = salesData.reduce((total, sale) => total + Number(sale.amount || 0), 0);
      const comprasTotal = salesData.filter(sale => sale.type === 'compra').reduce((total, purchase) => total + Number(purchase.amount || 0), 0);
      const serviciosTotal = servicesData.reduce((total, service) => total + Number(service.price_service || 0), 0);

      const ingresosTotales = Number(transactionData.ingresos || 0) + ventasTotal + serviciosTotal;
      const egresosTotales = Number(transactionData.egresos || 0) + comprasTotal;

      setSummary({
        ingresos: ingresosTotales,
        egresos: egresosTotales,
        balance: ingresosTotales - egresosTotales
      });
    } catch (error) {
      console.error('Error al obtener el resumen:', error);
      setSummary({ ingresos: 0, egresos: 0, balance: 0 });
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [transactions]);

  // Configuración del gráfico de barras
  const data = {
    labels: ["Ingresos", "Egresos", "Balance"],
    datasets: [
      {
        label: "Monto",
        data: [summary.ingresos, summary.egresos, summary.balance],
        backgroundColor: [
          "rgba(152,251,152, 0.8)",
          "rgb(240,128,128)",
          "rgba(84, 153, 199, 1)",
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
        new Date(t.transaction_date).toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      ),
      datasets: [
        {
          label: "Ingresos",
          data: sortedTransactions.map((t) =>
            t.transaction_type === "ingreso" || t.transaction_type === "venta" || t.transaction_type === "servicio" ? t.amount : null
          ),
          borderColor: "rgb(152,251,152)",
          backgroundColor: "rgb(152,251,152)",
          fill: false,
          spanGaps: true,
        },
        {
          label: "Egresos",
          data: sortedTransactions.map((t) =>
            t.transaction_type === "egreso" || t.transaction_type === "compra" ? t.amount : null
          ),
          borderColor: "rgba(240,128,128)",
          backgroundColor: "rgba(240,128,128)",
          fill: false,
          spanGaps: true,
        },
      ],
    };
  })();


  // Configuración del gráfico de torta
  const tortinhaData = {
    labels: ["Ingresos Totales", "Egresos Totales"],
    datasets: [
      {
        data: [summary.ingresos, summary.egresos],
        backgroundColor: ["rgba(152,251,152, 0.8)", "rgb(240,128,128)"],
        hoverBackgroundColor: ["rgba(152,251,152, 1)", "rgb(240,128,128, 1)"],
      },
    ],
  };

  // Configuración de opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        labels: {
          color: theme === "dark" ? "white" : "gray",
        },
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: theme === "dark" ? "white" : "gray",
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        type: "linear",
        ticks: {
          color: theme === "dark" ? "white" : "gray",
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.1)",
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
                  <h3 className="text-lg font-semibold mb-4">
                    Gráfico de Balance
                  </h3>
                  <Bar data={data} options={options} />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Gráfico de Línea
                  </h3>
                  <Line data={lineData} options={options} />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-background border-none rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Gráfico de Torta
                  </h3>
                  <div className="w-full h-[350px] items-center">
                    {" "}
                    {/* Fixed height container */}
                    <Pie data={tortinhaData} options={options} />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious
            className=" -left-4 flex items-center justify-center"
            variant="ghost"
          />
          <CarouselNext
            className="-right-4 flex items-center justify-center"
            variant="ghost"
          />
        </Carousel>
      </div>
    </Card>
  );
}
