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
  const [rut, setRut] = useState('12.345.678-9'); // Para vista previa inmediata
  const [profilePicture, setProfilePicture] = useState('/placeholder.svg');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('Datos Personales');

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
    console.log('Profile updated:', { name, phone, rut, oldPassword, newPassword, confirmNewPassword });
  };

  return (
    <main className="flex items-center justify-center">
      <Card className="w-full max-w-2xl px-12 py-12 bg-card rounded-2xl shadow-xl border-none">
        <CardContent className="space-y-8">
          <section className="flex flex-col items-center space-y-4">
            <div className="relative">
              <figure className="w-32 h-32 rounded-full overflow-hidden shadow-md">
                <img
                  src={profilePicture}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </figure>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-2 right-2 p-2 bg-primary rounded-full cursor-pointer hover:bg-accent transition-colors flex items-center justify-center"
              >
                <Camera className="h-5 w-5 text-card-foreground" />
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
              <h1 className="text-3xl font-semibold text-card-foreground">{name}</h1>
            </header>
          </section>

          {/* Tab Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('Datos Personales')}
              className={`py-2 px-4 ${activeTab === 'Datos Personales' ? 'border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
            >
              Datos Personales
            </button>
            <button
              onClick={() => setActiveTab('Seguridad')}
              className={`py-2 px-4 ${activeTab === 'Seguridad' ? 'border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
            >
              Seguridad
            </button>
          </div>

          {/* Datos Personales Form */}
          {activeTab === 'Datos Personales' && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">Datos personales</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="name" className="block text-sm text-muted-foreground">Nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg shadow-sm bg-background input-text placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="block text-sm text-muted-foreground">Teléfono</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg shadow-sm bg-background input-text placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor="rut" className="block text-sm text-muted-foreground">RUT</Label>
                  <Input
                    id="rut"
                    value={rut}
                    readOnly
                    className="mt-1 w-full px-4 py-2 rounded-lg shadow-sm bg-background input-text placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-not-allowed"
                  />
                </div>
                <Button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition">
                  Guardar Cambios
                </Button>
              </form>
            </section>
          )}

          {/* Seguridad Form */}
          {activeTab === 'Seguridad' && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">Cambiar clave</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="oldPassword" className="block text-sm text-muted-foreground">Actual</Label>
                  <div className="relative mt-1">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showOldPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="block text-sm text-muted-foreground">Nueva</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword" className="block text-sm text-muted-foreground">Confirmar nueva contraseña</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition">
                  Cambiar Contraseña
                </Button>
              </form>
            </section>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
