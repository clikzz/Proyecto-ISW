import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/api/profile';
import { useAlert } from '@context/alertContext';

export default function PersonalDataForm({
  name,
  setName,
  phone,
  setPhone,
  rut,
}) {
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        name_user: name,
        phone_user: phone,
      };
      const response = await updateProfile(profileData);
      showAlert(response.message, 'success');
    } catch (error) {
      showAlert(error.response?.data.message, 'error');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-card-foreground">
        Datos personales
      </h2>
      <div>
        <Label htmlFor="name" className="block text-sm text-muted-foreground">
          Nombre
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingresa tu nombre"
          required
        />
      </div>
      <div>
        <Label htmlFor="phone" className="block text-sm text-muted-foreground">
          Teléfono
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ingresa tu teléfono"
          required
        />
      </div>
      <div>
        <Label htmlFor="rut" className="block text-sm text-muted-foreground">
          RUT
        </Label>
        <Input id="rut" value={rut} readOnly className="cursor-not-allowed" />
      </div>
      <Button type="submit" className="w-full">
        Guardar Cambios
      </Button>
    </form>
  );
}
