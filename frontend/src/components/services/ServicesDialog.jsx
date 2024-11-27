import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ServicioDialog({ nuevoServicio, setNuevoServicio, handleSubmit }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition">
          Añadir Servicio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground shadow-lg rounded-lg outline-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Añadir Nuevo Servicio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Servicio</Label>
              <Input
                id="nombre"
                value={nuevoServicio.nombre}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                required
                className="bg-input text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={nuevoServicio.descripcion}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
                required
                className="bg-input text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <Label htmlFor="empleado">Empleado Asignado</Label>
              <Input
                id="empleado"
                value={nuevoServicio.empleado}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, empleado: e.target.value })}
                required
                className="bg-input text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <Label htmlFor="ingreso">Ingreso (CLP)</Label>
              <Input
                id="ingreso"
                type="number"
                value={nuevoServicio.ingreso}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, ingreso: e.target.value })}
                required
                className="bg-input text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={nuevoServicio.fecha}
                  onChange={(e) => setNuevoServicio({ ...nuevoServicio, fecha: e.target.value })}
                  required
                  className="bg-input text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={nuevoServicio.hora}
                  onChange={(e) => setNuevoServicio({ ...nuevoServicio, hora: e.target.value })}
                  required
                  className="bg-input text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
            </div>
          </fieldset>

          {/* Botón de acción */}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition">
            Guardar Servicio
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}