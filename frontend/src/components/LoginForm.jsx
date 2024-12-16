'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { loginUser } from '@api/auth';
import { useAuth } from '@context/authContext';
import { useAlert } from '@context/alertContext';

export default function LoginForm() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [eyeAnimation, setEyeAnimation] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { showAlert } = useAlert();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeAnimation(true);
    setTimeout(() => setEyeAnimation(false), 300);
  };

  const formatRut = (rut) => {
    let cleanRut = rut.replace(/[^0-9Kk]/g, '');
    if (cleanRut.length > 1) {
      cleanRut = cleanRut.replace(
        /^(\d{1,2})(\d{3})(\d{3})([0-9Kk])$/,
        '$1.$2.$3-$4'
      );
    }
    return cleanRut.slice(0, 12);
  };

  const handleRutChange = (e) => {
    const rawRut = e.target.value;
    const formatted = formatRut(rawRut);
    setRut(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(rut.toUpperCase(), password);
      login(response.token, response.role);
      showAlert(response.message, 'success');
      router.push('/home');
    } catch (error) {
      showAlert(error.response?.data.message, 'error');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
          maxLength={12}
          required
          className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
          placeholder="12.345.678-9"
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
            className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
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
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-input rounded bg-background checkbox-hover-animation"
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
  );
}
