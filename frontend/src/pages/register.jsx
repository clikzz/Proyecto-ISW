'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerUser } from '@hooks/useAuth';
import { useAuth } from '@context/authContext';
import { useRole } from '@context/roleContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [eyeAnimation, setEyeAnimation] = useState(false);
  const [eyeConfirmAnimation, setEyeConfirmAnimation] = useState(false);
  const [rut, setRut] = useState('');
  const [name_user, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password_user, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { login } = useAuth();
  const { changeRole } = useRole();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeAnimation(true);
    setTimeout(() => setEyeAnimation(false), 300);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setEyeConfirmAnimation(true);
    setTimeout(() => setEyeConfirmAnimation(false), 300);
  };

  const formatRut = (value) => {
    const cleanValue = value
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/\s+/g, '');
    if (cleanValue.length > 11) return rut;

    const cuerpo = cleanValue.slice(0, -1);
    const verificador = cleanValue.slice(-1);
    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedCuerpo}-${verificador}`;
  };

  const handleRutChange = (event) => {
    const formattedRut = formatRut(event.target.value);
    if (formattedRut.length <= 12) {
      setRut(formattedRut);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password_user !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await registerUser({
        rut,
        name_user,
        email,
        password_user,
      });
      login(response.token);
      changeRole(response.role);
      router.push('/home');
    } catch (err) {
      setError('Error al registrar. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="bg-card p-8 rounded-lg shadow-lg">
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

          {error && (
            <p className="text-sm text-center text-red-500 mb-4">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                value={name_user}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary transition"
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
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary transition"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary transition"
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
                  value={password_user}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary transition"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      className={`h-5 w-5 text-muted-foreground ${
                        eyeConfirmAnimation ? 'eye-animation' : ''
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`h-5 w-5 text-muted-foreground ${
                        eyeConfirmAnimation ? 'eye-animation' : ''
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-accent focus:ring-primary transition"
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
