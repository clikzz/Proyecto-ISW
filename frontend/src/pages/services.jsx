'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wrench, Search, User, Calendar, Clock, DollarSign } from 'lucide-react'
import ServicesList from '@/components/ServicesList' 
import ServicesDialog from '@/components/ServicesDialog' 

export default function ServicesPage() { 
  const [servicios, setServicios] = useState([
    {
      // EJEMPLO PORSIA
      nombre: "Reparación de Frenos",
      descripcion: "Ajuste y reemplazo de pastillas de freno",
      empleado: "Ana Garcia",
      ingreso: "50",
      fecha: "2023-11-20",
      hora: "10:00"
    },
  ])

  const [busqueda, setBusqueda] = useState('')
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    descripcion: '',
    empleado: '',
    ingreso: '',
    fecha: '',
    hora: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setServicios([...servicios, nuevoServicio])
    setNuevoServicio({
      nombre: '',
      descripcion: '',
      empleado: '',
      ingreso: '',
      fecha: '',
      hora: ''
    })
  }

  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    servicio.empleado.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <main className="min-h-screen p-8">
      <section className="max-w-7xl mx-auto">
        {/* Encabezado principal */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Wrench className="w-8 h-8" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Servicios</h1>
          </div>
        </header>

        <section aria-labelledby="buscar-servicio" className="mb-6">
          {/* Barra de búsqueda */}
          <form className="flex justify-between items-center" role="search" aria-labelledby="buscar-servicio">
            <label htmlFor="search" className="sr-only" id="buscar-servicio">Buscar servicios o técnicos</label>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" aria-hidden="true" />
              <Input
                id="search"
                type="text"
                placeholder="Buscar por servicio o técnico..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border"
              />
            </div>

            {/* Formulario para añadir un nuevo servicio */}
            <ServicesDialog
              nuevoServicio={nuevoServicio}
              setNuevoServicio={setNuevoServicio}
              handleSubmit={handleSubmit}
            />
          </form>
        </section>

        <section aria-labelledby="lista-servicios">
          <h2 id="lista-servicios" className="sr-only">Lista de Servicios</h2>
          <ServicesList servicios={serviciosFiltrados} />
        </section>
      </section>
    </main>
  )
}
