'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import useAuthRedirect from '@hooks/useAuthRedirect';

export default function ProfilePage() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1234567890');
  const [rut, setRut] = useState(''); // Estado para el RUT
  const [profilePicture, setProfilePicture] = useState(
    '/placeholder.svg?height=400&width=400'
  );
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Simulación de obtener el RUT desde el backend
    setTimeout(() => {
      setRut('12.345.678-9'); // Ejemplo de un RUT dinámico
    }, 1000);
  }, []);

  const isAuthorized = useAuthRedirect(['default', 'admin', 'employee']);

  if (!isAuthorized) {
    return null;
  }

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', {
      name,
      phone,
      rut,
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-4xl px-12 py-12 bg-card rounded-2xl shadow-xl border border-transparent">
        <CardContent className="space-y-12">
          <section className="flex flex-col items-center space-y-8">
            <div className="relative">
              <figure className="w-40 h-40 rounded-full overflow-hidden border-4 border-card shadow-md">
                <img
                  src={profilePicture}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </figure>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-2 right-2 p-2 bg-primary rounded-full cursor-pointer hover:bg-accent transition-colors"
              >
                <Camera className="h-6 w-6 text-primary-foreground" />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>
            <header className="text-center">
              <h1 className="text-4xl font-extrabold text-foreground">
                {name}
              </h1>
              <p className="text-base text-muted-foreground">RUT: {rut}</p>
            </header>
          </section>

          <div className="grid md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Datos personales
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label
                    htmlFor="name"
                    className="block text-sm text-foreground"
                  >
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full px-4 py-3 border border-input rounded-lg shadow-sm bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="block text-sm text-foreground"
                  >
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full px-4 py-3 border border-input rounded-lg shadow-sm bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition"
                >
                  Guardar Cambios
                </Button>
              </form>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Cambiar clave
              </h2>
              <form className="space-y-6">
                <div>
                  <Label
                    htmlFor="oldPassword"
                    className="block text-sm text-foreground"
                  >
                    Actual
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg shadow-sm bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showOldPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="newPassword"
                    className="block text-sm text-foreground"
                  >
                    Nueva
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg shadow-sm bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="confirmNewPassword"
                    className="block text-sm text-foreground"
                  >
                    Confirmar nueva contraseña
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg shadow-sm bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition"
                >
                  Cambiar Contraseña
                </Button>
              </form>
            </section>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
