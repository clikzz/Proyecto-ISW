'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, Search } from 'lucide-react';
import ServicesList from '@/components/services/ServicesList';
import ServicesDialog from '@/components/services/ServicesDialog';

// Importa las funciones de la API
import { getServices, createService, deleteService } from '@/api/service';

export default function ServicesPage() {
  const [servicios, setServicios] = useState([]); // Estado para manejar los servicios desde el backend
  const [busqueda, setBusqueda] = useState('');
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    descripcion: '',
    empleado: '',
    ingreso: '',
    fecha: '',
    hora: '',
  });

  // Cargar los servicios al cargar la página
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices(); // Obtén los servicios del backend
        setServicios(data);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
      }
    };
    fetchServices();
  }, []);

  // Manejar la creación de un nuevo servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = {
        name_service: nuevoServicio.nombre,
        description_service: nuevoServicio.descripcion,
        price_service: parseFloat(nuevoServicio.ingreso),
        date_service: `${nuevoServicio.fecha}T${nuevoServicio.hora}`, 
        user_rut: nuevoServicio.user_rut 
      };

      const createdService = await createService(newService); 
      setServicios([...servicios, createdService]); 
      setNuevoServicio({
        nombre: '',
        descripcion: '',
        empleado: '',
        ingreso: '',
        fecha: '',
        hora: '',
      });
    } catch (error) {
      console.error('Error al crear el servicio:', error);
    }
  };

  // Manejar la eliminación de un servicio
  const handleDelete = async (id) => {
    try {
      await deleteService(id); // Elimina el servicio en el backend
      setServicios(servicios.filter((servicio) => servicio.id_service !== id)); // Actualiza el estado local
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  // Filtrar los servicios por búsqueda
  const serviciosFiltrados = servicios.filter(
    (servicio) =>
      servicio.name_service.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.employee.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <main className="container mx-auto">
      <section className="container mx-auto">
        {/* Encabezado principal */}
        <header className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <Wrench className="w-8 h-8" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Servicios</h1>
          </div>
        </header>

        <section aria-labelledby="buscar-servicio" className="mb-6">
          {/* Barra de búsqueda */}
          <form className="flex justify-between items-center" role="search" aria-labelledby="buscar-servicio">
            <label htmlFor="search" className="sr-only" id="buscar-servicio">
              Buscar servicios o técnicos
            </label>
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
            <ServicesDialog nuevoServicio={nuevoServicio} setNuevoServicio={setNuevoServicio} handleSubmit={handleSubmit} />
          </form>
        </section>

        <section aria-labelledby="lista-servicios">
          <h2 id="lista-servicios" className="sr-only">
            Lista de Servicios
          </h2>
          <ServicesList servicios={serviciosFiltrados} onDeleteServicio={handleDelete} />
        </section>
      </section>
    </main>
  );
}
