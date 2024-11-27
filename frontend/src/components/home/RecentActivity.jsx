import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const sampleActivities = [
  { action: "Venta", item: "Bicicleta de montaña", time: "hace 2 horas" },
  { action: "Reparación", item: "Frenos de disco", time: "hace 4 horas" },
  { action: "Compra", item: "Lote de cascos", time: "hace 1 día" },
  { action: "Mantenimiento", item: "Cambio de aceite", time: "hace 2 días" },
];

export function RecentActivity() {
  return (
    <Card className="bg-background border-none rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {sampleActivities.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <p className="font-medium">
                  {activity.action} {activity.item}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

