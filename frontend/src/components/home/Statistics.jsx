'use client'

import { useEffect, useState } from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Package, Clock, Users, ShoppingCart } from 'lucide-react';
import { getInventoryItems, getSales } from '@/api/inventory';

export function Statistics() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getInventoryItems();
        setTotalProducts(items.length);

        const salesData = await getSales();

        // Calcular el total de ventas del último mes
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const lastMonthSales = salesData.filter(sale =>
          new Date(sale.transaction_date) >= oneMonthAgo
        );

        const totalQuantity = lastMonthSales.reduce((total, sale) =>
          total + sale.quantity_item, 0
        );

        setTotalSales(totalQuantity);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Productos" value={totalProducts} icon={Package} />
      <StatCard title="Ventas Mensuales" value={totalSales} icon={ShoppingCart} subtext="Último mes" />
      <StatCard title="Total Empleados" value={5} icon={Users} />
      <StatCard title="Actividad del Taller" value="2 meses" icon={Clock} subtext="Activo desde Oct 2024" />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, subtext }) {
  return (
    <Card className="bg-background border-none rounded-lg shadow-sm">
      <div className="flex flex-row items-center justify-between p-6">
        <div className="flex flex-col justify-between space-y-0">
          <CardTitle className="text-sm font-medium mb-2">{title}</CardTitle>
          <div className="text-2xl font-bold">{value}</div>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground ml-auto" />
      </div>
    </Card>
  );
}
