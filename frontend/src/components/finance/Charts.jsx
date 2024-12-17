import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement,
ArcElement,
Title,
Tooltip,
Legend,
} from 'chart.js/auto';
import {
Carousel,
CarouselContent,
CarouselItem,
CarouselNext,
CarouselPrevious,
} from "@/components/ui/carousel";
import { getServices } from '@/api/service';

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement,
ArcElement,
Title,
Tooltip,
Legend
);

export default function Charts({ transactions }) {
const { theme } = useTheme();
const [summary, setSummary] = useState({ ingresos: 0, egresos: 0, balance: 0 });
const [allTransactions, setAllTransactions] = useState([]);

useEffect(() => {
 const fetchAllData = async () => {
   try {
     const services = await getServices();

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
         amount: service.price_service,
         transaction_date: service.created_at
       }));

     const combinedData = [
       ...formattedTransactions,
       ...formattedServices
     ];

     setAllTransactions(combinedData);

     const ingresos = combinedData
       .filter(t => t.transaction_type === 'ingreso' || t.transaction_type === 'venta' || t.transaction_type === 'servicio')
       .reduce((total, t) => total + Number(t.amount || 0), 0);

     const egresos = combinedData
       .filter(t => t.transaction_type === 'egreso' || t.transaction_type === 'compra')
       .reduce((total, t) => total + Number(t.amount || 0), 0);

     setSummary({
       ingresos: ingresos,
       egresos: egresos,
       balance: ingresos - egresos
     });
   } catch (error) {
     console.error('Error al cargar los datos:', error);
   }
 };

 fetchAllData();
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
 // Filtrar y ordenar las transacciones por fecha
 const sortedTransactions = allTransactions
   .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

 const ingresos = sortedTransactions.map((t) =>
   t.transaction_type === "ingreso" || t.transaction_type === "venta" || t.transaction_type === "servicio" ? t.amount : 0
 );

 const egresos = sortedTransactions.map((t) =>
   t.transaction_type === "egreso" || t.transaction_type === "compra" ? t.amount : 0
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
       data: ingresos,
       borderColor: "rgba(152,251,152, 1)",
       backgroundColor: "rgba(152,251,152, 1)",
       fill: false,
       spanGaps: true,
     },
     {
       label: "Egresos",
       data: egresos,
       borderColor: "rgba(240,128,128, 1)",
       backgroundColor: "rgba(240,128,128, 1)",
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
     backgroundColor: ["rgba(152,251,152, 1)", "rgb(240,128,128, 1)"],
     borderColor: ["rgba(152,251,152, 1)", "rgb(240,128,128, 1)"],
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
                 <Pie data={tortinhaData} options={options} />
               </div>
             </CardContent>
           </Card></CarouselItem>
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
