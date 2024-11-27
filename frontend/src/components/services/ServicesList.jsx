import { User, Calendar, Clock, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ServicesList({ servicios, onDeleteServicio }) {
  return (
    <ul className="space-y-4">
      {servicios.map((servicio) => (
        <li
          key={servicio.id_service} // Clave única para cada servicio
          className="flex justify-between items-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground"
          aria-labelledby={`servicio-${servicio.id_service}-nombre`}
        >
          {/* Información principal del servicio */}
          <article className="flex-1">
            {/* Encabezado del servicio */}
            <header>
              <h2 id={`servicio-${servicio.id_service}-nombre`} className="text-lg font-semibold mb-2">
                {servicio.name_service}
              </h2>
            </header>

            {/* Descripción del servicio */}
            <p className="text-sm mb-4">{servicio.description_service}</p>

            {/* Información del empleado */}
            <section className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>{servicio.employee || 'No asignado'}</span>
            </section>
          </article>

          {/* Detalles secundarios: Dinero, Fecha y Hora */}
          <aside className="text-right">
            <div>
              <strong className="text-xl font-bold text-green-500" aria-label="Ingreso">
                ${servicio.price_service}
              </strong>
            </div>

            {/* Fecha y Hora */}
            <section className="flex items-center justify-end mt-2 text-sm space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                <time dateTime={servicio.date_service}>{new Date(servicio.date_service).toLocaleDateString()}</time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                <time>{new Date(servicio.date_service).toLocaleTimeString()}</time>
              </div>
            </section>
          </aside>

          {/* Botón de eliminar */}
          <Button
            variant="ghost" // Botón transparente
            size="icon"
            className="ml-4"
            onClick={() => onDeleteServicio(servicio.id_service)}
            aria-label={`Eliminar servicio ${servicio.name_service}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

