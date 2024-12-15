import React, { useState, useEffect } from 'react';
import { Search, Filter, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getServices, deleteService } from '@/api/service';
import { capitalize } from '@/helpers/capitalize';
import ExportButtons from '@/components/services/ExportButtons';
import ServiceDetailsDialog from '@/components/services/dialog/ServiceDetailsDialog';
import EditServiceDialog from '@/components/services/dialog/EditServiceDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddServiceDialog from '@/components/services/dialog/ServicesDialog';
import { useAlert } from '@/context/alertContext';

export default function ServicesTable() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
        showAlert('Error al cargar los servicios. Por favor, inténtalo de nuevo.', 'error');
      }
    };
    fetchServices();
  }, []);


  const handleAddService = (newService) => {
    setServices((prev) => [...prev, newService]);
    showAlert('Servicio agregado correctamente', 'success');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este servicio?');
    if (!confirmDelete) return;

    try {
      await deleteService(id);
      setServices((prev) => prev.filter((service) => service.id_service !== id));
      showAlert('Servicio eliminado correctamente', 'success');
    } catch (error) {
      showAlert('Error al eliminar el servicio', 'error');
    }
  };


  const handleView = (service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };


  const handleEdit = (service) => {
    setSelectedService(service);
    setIsEditOpen(true);
  };



  const handleUpdateService = (updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id_service === updatedService.id_service ? updatedService : service
      )
    );
    setIsEditOpen(false);
  };


  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name_service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'todas' ||
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" aria-hidden="true" />
          <Input
            type="text"
            placeholder="Buscar por servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border"
          />
        </div>
        <div className="flex-shrink-0">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
              <SelectItem value="reparación">Reparación</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="personalización">Personalización</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <ExportButtons servicios={filteredServices} />
          <AddServiceDialog onAddService={handleAddService} />
        </div>
      </div>

      {/* Tabla de servicios */}
      <Card className="border-none pt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow key={service.id_service}>
                    <TableCell>{capitalize(service.name_service)}</TableCell>
                    <TableCell>{capitalize(service.category)}</TableCell>
                    <TableCell>${service.price_service?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{capitalize(service.payment_method_service || 'Sin definir')}</TableCell>
                    <TableCell>Sin asignar</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            <EllipsisVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 w-48">
                          <DropdownMenuItem
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300"
                            onClick={() => handleView(service)}
                          >
                            Ver información
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300"
                            onClick={() => handleEdit(service)}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-red-100 dark:hover:bg-red-700 px-4 py-2 cursor-pointer text-red-600 dark:text-red-400"
                            onClick={() => handleDelete(service.id_service)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay servicios disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de ver detalles */}
      <ServiceDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        service={selectedService}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateService={handleUpdateService} // <- Añadido aquí
      />


      {/* Diálogo de editar servicio */}
      <EditServiceDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        service={selectedService}
        onUpdateService={handleUpdateService}
      />
    </div>
  );
}