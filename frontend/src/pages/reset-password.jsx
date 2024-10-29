'use client';

import React, { useState } from 'react';
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@hooks/useAuth';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await resetPassword(token, password);
      setResetSuccess(true);
    } catch (error) {
      setError('Error al restablecer la contraseña');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="bg-card p-8 rounded-lg shadow-lg fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Key className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-4">
            Restablecer tu contraseña
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
          </p>

          {!resetSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6 fade-in">
              {/* Nueva contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Nueva contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground eye-animation" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground eye-animation" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirmar nueva contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground eye-animation" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground eye-animation" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Restablecer contraseña
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 fade-in">
              <p className="text-sm text-muted-foreground">
                Tu contraseña ha sido restablecida exitosamente.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="font-medium text-primary hover:text-accent-foreground"
              >
                Ir a iniciar sesión
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-center">
            <button
              onClick={() => router.push('/login')}
              className="flex items-center justify-center font-medium text-primary hover:text-accent-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
