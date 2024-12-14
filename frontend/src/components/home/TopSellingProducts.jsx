import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getSales } from "@/api/inventory";
import { formatDateTime } from "@/helpers/dates";

export function TopSellingProducts() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const salesData = await getSales();

        // Procesar los datos para obtener los productos más vendidos
        const productSummary = salesData.reduce((acc, sale) => {
          if (!acc[sale.name_item]) {
            acc[sale.name_item] = {
              name: sale.name_item,
              totalQuantity: 0,
              lastSaleDate: sale.transaction_date
            };
          }

          acc[sale.name_item].totalQuantity += sale.quantity_item;

          // Actualizar la fecha si es más reciente
          if (new Date(sale.transaction_date) > new Date(acc[sale.name_item].lastSaleDate)) {
            acc[sale.name_item].lastSaleDate = sale.transaction_date;
          }

          return acc;
        }, {});

        // Convertir a array y ordenar por cantidad
        const sortedProducts = Object.values(productSummary)
          .sort((a, b) => b.totalQuantity - a.totalQuantity)
          .slice(0, 4); // Tomar los 4 más vendidos

        setTopProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    }

    fetchTopProducts();
  }, []);

  return (
    <Card className="bg-background border-none rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
        <div className="space-y-4">
          {topProducts.map((product) => (
            <motion.div
              key={product.name}
              className="flex items-center justify-between rounded-lg p-3 bg-background hover:bg-accent transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Último vendido: {formatDateTime(product.lastSaleDate)}
                </p>
              </div>
              <div className="text-lg font-semibold">
                {product.totalQuantity} unidades
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
