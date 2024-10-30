import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1234567890');
  const [rut] = useState('12.345.678-9'); // RUT visual, no modificable
  const [profilePicture, setProfilePicture] = useState('/placeholder.svg?height=400&width=400');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    console.log('Datos personales guardados:', { name, phone });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Contraseña cambiada:', { oldPassword, newPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300 fade-in">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl w-full space-y-12 scale-fade-animation">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Área de datos personales */}
          <aside className="md:w-1/2 flex flex-col items-center space-y-2">
            <figure className="relative w-64 h-64">
              <img
                src={profilePicture}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover shadow-lg"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
              >
                <Camera className="h-6 w-6" />
                <input
                  id="profile-picture"
                  name="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </figure>
            <h1 className="text-2xl font-bold text-center text-foreground">{name}</h1>
            <p className="text-sm text-muted-foreground">{rut}</p> {/* RUT en estilo minimalista */}

            <form onSubmit={handlePersonalSubmit} className="space-y-4 w-full mt-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-opacity-50 placeholder-opacity-60"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-opacity-50 placeholder-opacity-60"
                  placeholder="Ingresa tu número de teléfono"
                />
              </div>
              <Button type="submit" className="w-full">Guardar Cambios</Button>
            </form>
          </aside>

          {/* Área de credenciales */}
          <section className="md:w-1/2 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Cambiar Contraseña</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <Label htmlFor="oldPassword" className="text-sm font-medium text-foreground">Contraseña Actual</Label>
                <Input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pr-12 bg-opacity-50 placeholder-opacity-60"
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                >
                  {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-12 bg-opacity-50 placeholder-opacity-60"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button type="submit" className="w-full">Cambiar Contraseña</Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
