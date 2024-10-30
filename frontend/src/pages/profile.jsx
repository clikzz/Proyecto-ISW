import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Pencil, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1234567890');
  const [profilePicture, setProfilePicture] = useState('/placeholder.svg?height=400&width=400');
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
    console.log('Profile updated:', { name, phone, oldPassword, newPassword });
    setEditingName(false);
    setEditingPhone(false);
    setEditingPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300 fade-in">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="md:w-1/3 flex flex-col items-center">
            <figure className="relative w-64 h-64 mb-6">
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
            <figcaption>
              <h1 className="text-2xl font-bold text-center text-foreground">{name}</h1>
            </figcaption>
          </aside>

          <section className="md:w-2/3">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Nombre</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="pr-10"
                    disabled={!editingName}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2"
                    onClick={() => setEditingName(!editingName)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">Teléfono</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Tu número de teléfono"
                    className="pr-10"
                    disabled={!editingPhone}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2"
                    onClick={() => setEditingPhone(!editingPhone)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Contraseña</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPassword(!editingPassword)}
                  >
                    {editingPassword ? 'Cancelar' : 'Cambiar contraseña'}
                  </Button>
                </div>
                {editingPassword && (
                  <>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Contraseña actual"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowOldPassword((prev) => !prev)}
                      >
                        {showOldPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" className="w-full">
                Guardar Cambios
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
