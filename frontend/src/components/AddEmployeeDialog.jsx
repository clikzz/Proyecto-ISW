import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { addEmployee } from '@api/employees';
import { useAlert } from '@context/alertContext';

export default function AddEmployeeDialog({ fetchEmployees }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name_user: '',
    rut: '',
    email: '',
  });
  const { showAlert } = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const formatRut = (value) => {
    const cleanValue = value
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/\s+/g, '');
    if (cleanValue.length > 11) return value;

    const cuerpo = cleanValue.slice(0, -1);
    const verificador = cleanValue.slice(-1);
    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedCuerpo}-${verificador}`;
  };

  const handleRutChange = (event) => {
    const formattedRut = formatRut(event.target.value);
    if (formattedRut.length <= 12) {
      setNewEmployee((prev) => ({ ...prev, rut: formattedRut }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Employee added:', newEmployee);
      await addEmployee(newEmployee);
      showAlert('Empleado añadido', 'success');
      setIsDialogOpen(false);
      setNewEmployee({
        name_user: '',
        rut: '',
        email: '',
      });
      fetchEmployees();
    } catch (error) {
      showAlert(error.response?.data.errors, 'error');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir empleado
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Nuevo empleado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name_user">Nombre</Label>
            <Input
              id="name_user"
              name="name_user"
              value={newEmployee.name_user}
              onChange={handleInputChange}
              placeholder="Nombre completo"
              required
            />
          </div>
          <div>
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              name="rut"
              value={newEmployee.rut}
              onChange={handleRutChange}
              placeholder="12.345.678-9"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              placeholder="ejemplo@mail.com"
              required
            />
          </div>
          <Button type="submit">Agregar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
