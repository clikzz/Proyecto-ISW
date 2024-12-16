import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, EllipsisVertical, ArrowUpDown } from 'lucide-react';
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
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useAuth } from '@/context/authContext';


export default function ServicesTable() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const { showAlert } = useAlert();
  const { role, loading } = useAuth();


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


  const openConfirmationDialog = (id) => {
    setServiceToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setServiceToDelete(null);
    setIsConfirmationDialogOpen(false);
  };


  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete);
        setServices((prevServices) =>
          prevServices.filter((service) => service.id_service !== serviceToDelete)
        );
        showAlert('Servicio eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar el Servicio:', error);
        showAlert('Ocurrió un error al eliminar el Servicio', 'error');
      } finally {
        closeConfirmationDialog();
      }
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


  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const sortedAndFilteredServices = useMemo(() => {
    let sortableServices = [...services];

    if (sortConfig.key !== null) {
      sortableServices.sort((a, b) => {
        if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key]?.localeCompare(b[sortConfig.key] || '')
            : b[sortConfig.key]?.localeCompare(a[sortConfig.key] || '');
        }
        else if (typeof a[sortConfig.key] === 'number') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
        return 0;
      });
    }

    return sortableServices.filter((service) => {
      const matchesSearch = service.name_service
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'todas' ||
        service.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory, sortConfig]);


  const ServiceStatus = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    let displayText = "";

    switch (status?.toLowerCase()) {
      case "in_progress":
        bgColor = "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/40";
        textColor = "text-blue-700 dark:text-blue-300";
        displayText = "En Proceso";
        break;

      case "done":
        bgColor = "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/40";
        textColor = "text-green-700 dark:text-green-300";
        displayText = "Completado/a";
        break;

      case "unassigned":
        bgColor = "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800/40";
        textColor = "text-violet-700 dark:text-violet-300";
        displayText = "No Asignado/a";
        break;

      default:
        bgColor = "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/40 dark:border-yellow-700/40";
        textColor = "text-yellow-700 dark:text-yellow-300";
        displayText = "Desconocido";

    }

    return (
      <span
        className={`inline-block px-3 py-1 rounded-lg border ${bgColor} ${textColor} text-xs font-medium`}
      >
        {displayText}
      </span>
    );
  };


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
          <ExportButtons servicios={sortedAndFilteredServices} />
          <AddServiceDialog onAddService={handleAddService} />
        </div>
      </div>

      {/* Tabla de servicios */}
      <Card className="border-none pt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name_service')}
                    className="text-foreground"
                  >
                    <strong>Nombre</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('category')}
                    className="text-foreground"
                  >
                    <strong>Categoría</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('price_service')}
                    className="text-foreground"
                  >
                    <strong>Precio</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('payment_method_service')}
                    className="text-foreground"
                  >
                    <strong>Método de Pago</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('employee_name')}
                    className="text-foreground"
                  >
                    <strong>Empleado</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('status_service')}
                    className="text-foreground"
                  >
                    <strong>Estado</strong>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <strong className="text-foreground">Acciones</strong>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredServices.length > 0 ? (
                sortedAndFilteredServices.map((service) => (
                  <TableRow key={service.id_service}>
                    <TableCell>{capitalize(service.name_service)}</TableCell>
                    <TableCell>{capitalize(service.category)}</TableCell>
                    <TableCell>${service.price_service?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{capitalize(service.payment_method_service || 'Sin definir')}</TableCell>
                    <TableCell>
                      {service.employee_name ? capitalize(service.employee_name) : 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <ServiceStatus status={service.status_service} />
                    </TableCell>
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
                          {role === 'admin' && (
                          <DropdownMenuItem
                            className={`hover:bg-red-100 dark:hover:bg-red-700 px-4 py-2 cursor-pointer ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : 'text-red-600 dark:text-red-400'
                              }`}
                            onClick={() => openConfirmationDialog(service.id_service)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                          )}
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
        onDelete={handleConfirmDelete}
        onUpdateService={handleUpdateService}
      />

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        handleClose={closeConfirmationDialog}
        handleConfirm={handleConfirmDelete}
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