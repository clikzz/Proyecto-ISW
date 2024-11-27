import { Card, CardTitle } from "@/components/ui/card";
import { Package, Clock, Users, ShoppingCart } from 'lucide-react';

export function Statistics({ totalProducts, recentSales, totalEmployees, mesesActivos }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Productos" value={totalProducts} icon={Package} subtext="+10% esta semana" />
      <StatCard title="Ventas Recientes" value={recentSales} icon={ShoppingCart} subtext="Últimos 7 días" />
      <StatCard title="Total Empleados" value={totalEmployees} icon={Users} />
      <StatCard title="Actividad del Taller" value={`${mesesActivos} meses`} icon={Clock} subtext="Activo desde Oct 2024" />
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
