'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerUser } from '@hooks/useAuth';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [eyeAnimation, setEyeAnimation] = useState(false);
  const [rut, setRut] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeAnimation(true);
    setTimeout(() => setEyeAnimation(false), 300);
  };

  const formatRut = (value) => {
    const cleanValue = value.replace(/\./g, '').replace(/-/g, '').replace(/\s+/g, '');

    // Limitar el RUT a 11 caracteres (sin puntos ni guion)
    if (cleanValue.length > 11) return rut;

    const cuerpo = cleanValue.slice(0, -1);
    const verificador = cleanValue.slice(-1);

    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedCuerpo}-${verificador}`;
  };

  const handleRutChange = (event) => {
    const formattedRut = formatRut(event.target.value);

    // Limitar a 12 caracteres con puntos y guion
    if (formattedRut.length <= 12) {
      setRut(formattedRut);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="bg-card p-8 rounded-lg shadow-lg fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-4">
            Regístrate
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/login"
              className="font-medium text-primary hover:text-accent-foreground transition duration-300"
            >
              Inicia sesión
            </a>
          </p>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div>
              <label
                htmlFor="rut"
                className="block text-sm font-medium text-foreground"
              >
                RUT
              </label>
              <input
                id="rut"
                name="rut"
                type="text"
                value={rut}
                onChange={handleRutChange}
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                placeholder="12.345.678-9"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                placeholder="tu@ejemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff
                      className={`h-5 w-5 text-muted-foreground ${
                        eyeAnimation ? 'eye-animation' : ''
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`h-5 w-5 text-muted-foreground ${
                        eyeAnimation ? 'eye-animation' : ''
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-foreground"
              >
                Confirmar Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary button-pulse"
              >
                Regístrate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
