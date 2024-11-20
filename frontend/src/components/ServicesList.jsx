import { User, Calendar, Clock } from 'lucide-react'

export default function ServicesList({ servicios }) {
  return (
    <ul className="space-y-4">
      {servicios.map((servicio, index) => (
        <li
          key={index}
          className="flex justify-between items-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground"
          aria-labelledby={`servicio-${index}-nombre`}
        >
          {/* Información principal del servicio */}
          <article className="flex-1">
            {/* Encabezado del servicio */}
            <header>
              <h2 id={`servicio-${index}-nombre`} className="text-lg font-semibold mb-2">
                {servicio.nombre}
              </h2>
            </header>

            {/* Descripción del servicio */}
            <p className="text-sm mb-4">{servicio.descripcion}</p>

            {/* Información del empleado */}
            <section className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>{servicio.empleado}</span>
            </section>
          </article>

          {/* Detalles secundarios: Dinero, Fecha y Hora */}
          <aside className="text-right">
            {/* Dinero */}
            <div>
              <strong className="text-xl font-bold text-green-500" aria-label="Ingreso">
                ${servicio.ingreso}
              </strong>
            </div>

            {/* Fecha y Hora */}
            <section className="flex items-center justify-end mt-2 text-sm space-x-4">
              {/* Fecha */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                <time dateTime={servicio.fecha}>{servicio.fecha}</time>
              </div>
              {/* Hora */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                <time>{servicio.hora}</time>
              </div>
            </section>
          </aside>
        </li>
      ))}
    </ul>
  )
}
