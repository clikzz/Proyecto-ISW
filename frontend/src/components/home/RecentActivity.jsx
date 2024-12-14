import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getServices } from "@/api/service";
import { formatDateTime } from "@/helpers/dates";

export function RecentActivity() {
  const [recentServices, setRecentServices] = useState([]);

  useEffect(() => {
    async function fetchRecentServices() {
      try {
        const servicesData = await getServices();

        // Procesar los datos para obtener los servicios recientes
        const serviceSummary = servicesData.reduce((acc, service) => {
          if (!acc[service.name_service]) {
            acc[service.name_service] = {
              name: service.name_service,
              lastServiceDate: service.created_at
            };
          }

          // Actualizar la fecha si es más reciente
          if (new Date(service.transaction_date) > new Date(acc[service.name_service].lastServiceDate)) {
            acc[service.name_service].lastServiceDate = service.transaction_date;
          }

          return acc;
        }, {});

        // Convertir a array y ordenar por fecha
        const sortedServices = Object.values(serviceSummary)
          .sort((a, b) => new Date(b.lastServiceDate) - new Date(a.lastServiceDate))
          .slice(0, 4); // Tomar los 4 más recientes

        setRecentServices(sortedServices);
      } catch (error) {
        console.error("Error fetching recent services:", error);
      }
    }

    fetchRecentServices();
  }, []);

  return (
    <Card className="bg-background border-none rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actividades Recientes</h3>
        <div className="space-y-4">
          {recentServices.map((service) => (
            <motion.div
              key={service.name}
              className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex-1">
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  Último servicio: {formatDateTime(service.lastServiceDate)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
