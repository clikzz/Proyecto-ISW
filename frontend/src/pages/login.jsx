'use client';

import React from 'react';
import { LogIn } from 'lucide-react';
import LoginForm from '@components/LoginForm';
import Link from 'next/link';
import { useAuth } from '@context/authContext';
import router from 'next/router';

export default function Login() {
  if (useAuth().isAuthenticated) {
    router.push('/home');
    return null;
  }
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
            ¿No tienes una cuenta? <br />
            Ponte en contacto con un administrador
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
