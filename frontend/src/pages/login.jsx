'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { loginUser } from '@hooks/useAuth';
import { useAuth } from '../context/authContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [eyeAnimation, setEyeAnimation] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeAnimation(true);
    setTimeout(() => setEyeAnimation(false), 300); // Detenemos la animación tras 300ms
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUser(email, password);
      login(response.token);
      router.push('/home'); // Redirigir a la página protegida
      console.log('Usuario logueado:', response);
    } catch (error) {
      setError('Error en el inicio de sesión. Por favor, inténtalo de nuevo.');
      console.error(
        'Error en el inicio de sesión:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="bg-card p-8 rounded-lg shadow-lg fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-4">
            Iniciar sesión
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-accent-foreground transition duration-300"
            >
              Regístrate
            </Link>
          </p>

          {error && (
            <p className="text-sm text-center text-red-500 mb-4">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Aplicamos la animación pulse al checkbox */}
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded bg-background animate-pulse"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-muted-foreground"
                >
                  Recordarme
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary hover:text-accent-foreground transition duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}