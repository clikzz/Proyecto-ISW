'use client';

import { useState, useEffect } from 'react';
import { Wrench, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServicesList from '@/components/services/ServicesList';
import ServicesDialog from '@/components/services/ServicesDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExportButtons from '@/components/services/ExportButtoms'; 

import { getServices, createService, deleteService } from '@/api/service';

export default function ServicesPage() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    ingreso: '',
  });

  // Cargar los servicios al cargar la página
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices(selectedCategory !== 'all' ? selectedCategory : '');
        setServicios(data);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  // Manejar la creación de un nuevo servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = {
        name_service: nuevoServicio.nombre,
        description_service: nuevoServicio.descripcion,
        price_service: parseFloat(nuevoServicio.ingreso),
        date_service: `${nuevoServicio.fecha}T${nuevoServicio.hora}`,
        user_rut: nuevoServicio.user_rut,
      };

      const createdService = await createService(newService);
      setServicios([...servicios, createdService]);
      setNuevoServicio({
        nombre: '',
        descripcion: '',
        categoria: '',
        ingreso: '',
      });
    } catch (error) {
      console.error('Error al crear el servicio:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setServicios(servicios.filter((servicio) => servicio.id_service !== id));
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  // Filtrar los servicios por búsqueda y categoría
  const serviciosFiltrados = servicios.filter((servicio) => {
    const matchesSearch =
      servicio.name_service.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.description_service.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || servicio.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container mx-auto px-6 lg:px-10">
      <section className="container mx-auto">
        {/* Encabezado principal */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wrench className="w-8 h-8" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Servicios</h1>
          </div>
          {/* Componente de botones de exportación */}
          <ExportButtons servicios={serviciosFiltrados} />
        </header>

        <section className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" aria-hidden="true" />
            <Input
              id="search"
              type="text"
              placeholder="Buscar por servicio o técnico..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border"
            />
          </div>

          {/* Menú desplegable para filtrar */}
          <div className="flex-shrink-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[120px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="repair">Reparación</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="customization">Personalización</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
