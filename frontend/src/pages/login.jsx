'use client';

import React from 'react';
import { LogIn } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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
          <div className="mt-4 flex justify-center">
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger asChild>
                <p className="text-sm text-primary cursor-pointer underline hover:text-primary-foreground">
                  Ver Demo
                </p>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-center bg-muted text-muted-foreground p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Credenciales de prueba:</p>
                <p className="text-sm">
                  <span className="font-bold">RUT:</span> 12345678-9
                </p>
                <p className="text-sm">
                  <span className="font-bold">Contraseña:</span> admin
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
}
