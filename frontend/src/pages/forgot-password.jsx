'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '@/hooks/useAuth';

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      forgotPassword(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="bg-card p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-4">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            No te preocupes, te enviaremos un enlace para restablecer tu
            contraseña.
          </p>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary animate-pulse"
                >
                  Enviar enlace
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Si el correo ingresado está asociado a una cuenta, recibirás un
                enlace para restablecer tu contraseña.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="font-medium text-primary hover:text-accent-foreground transition duration-300"
              >
                ¿Ingresaste mal tu correo? Intenta de nuevo.
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-center">
            <a
              href="/login"
              className="flex items-center justify-center font-medium text-primary hover:text-accent-foreground transition duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
