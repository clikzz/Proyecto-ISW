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

export default function AddEmployeeDialog({ fetchEmployees }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    rut: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Employee added:', newEmployee);
      await addEmployee(newEmployee);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
    setIsDialogOpen(false);
    fetchEmployees();
    setNewEmployee({
      name_user: '',
      rut: '',
      email: '',
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir empleado
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none">
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
              onChange={handleInputChange}
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
