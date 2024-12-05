import React, { useState, useEffect } from 'react';
import { Search, Trash, Filter } from 'lucide-react';
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
import AddServiceDialog from '@/components/services/ServicesDialog';
import { getServices, deleteService } from '@/api/service';
import { capitalize } from '@/helpers/capitalize';
import ExportButtons from '@/components/services/ExportButtons';

export default function ServicesTable() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((service) => service.id_service !== id));
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service); 
  };

  const handleAddService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  const handleUpdateService = (updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id_service === updatedService.id_service ? updatedService : service
      )
    );
    setEditingService(null); 
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name_service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description_service.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        <ExportButtons servicios={filteredServices} />
      </div>

      {/* Tabla de servicios */}
      <Card className="border-none pt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow key={service.id_service}>
                    <TableCell>{capitalize(service.name_service)}</TableCell>
                    <TableCell>{capitalize(service.description_service)}</TableCell>
                    <TableCell>{capitalize(service.category)}</TableCell>
                    <TableCell>${service.price_service?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(service.id_service)}
                      >
                        <Trash className="h-4 w-4" />              
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay servicios disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}