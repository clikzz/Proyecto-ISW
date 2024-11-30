import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function ServicesList({ servicios, onDeleteServicio }) {
  return (
    <Card className="border-none shadow-md rounded-lg">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <strong>Nombre</strong>
              </TableHead>
              <TableHead>
                <strong>Usuario Asignado</strong>
              </TableHead>
              <TableHead>
                <strong>Descripción</strong>
              </TableHead>
              <TableHead>
                <strong>Categoría</strong>
              </TableHead>
              <TableHead>
                <strong>Precio (CLP)</strong>
              </TableHead>
              <TableHead>
                <strong>Acciones</strong>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <TableRow key={servicio.id_service} className="hover:bg-muted">
                  <TableCell>{servicio.name_service}</TableCell>
                  <TableCell>
                    {servicio.employee_name || "No asignado"}
                  </TableCell>
                  <TableCell>{servicio.description_service}</TableCell>
                  <TableCell className="capitalize">
                    {servicio.category || "Sin categoría"}
                  </TableCell>
                  <TableCell>
                    ${servicio.price_service?.toLocaleString("es-CL") || "0"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteServicio(servicio.id_service)}
                      aria-label={`Eliminar servicio ${servicio.name_service}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center text-muted-foreground">
                  No hay servicios disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
