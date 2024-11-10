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
import { addUser } from '@api/user';
import { useAlert } from '@context/alertContext';

export default function AddUserDialog({ fetchUsers }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name_user: '',
    rut: '',
    email: '',
  });
  const { showAlert } = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
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
      setNewUser((prev) => ({ ...prev, rut: formattedRut }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('User added:', newUser);
      await addUser(newUser);
      showAlert('User añadido', 'success');
      setIsDialogOpen(false);
      setNewUser({
        name_user: '',
        rut: '',
        email: '',
      });
      fetchUsers();
    } catch (error) {
      showAlert(error.response?.data.errors, 'error');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center rounded-xl">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Formulario de nuevo usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name_user">Nombre</Label>
            <Input
              id="name_user"
              name="name_user"
              value={newUser.name_user}
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
              value={newUser.rut}
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
              value={newUser.email}
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
