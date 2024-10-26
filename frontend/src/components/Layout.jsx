// components/Layout.jsx
import { Bike, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado del tema
  const [animateIcon, setAnimateIcon] = useState(false); // Controla la animación del icono
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Sincronizar el tema con localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Cambiar entre modo claro y oscuro con animación
  const toggleDarkMode = () => {
    setAnimateIcon(true); // Activa la animación del icono
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);

    // Desactiva la animación después de 500ms
    setTimeout(() => setAnimateIcon(false), 500);
  };

  return (
    <div className="theme-transition min-h-screen">
      <header className="absolute px-4 lg:px-6 h-14 flex items-center w-full">
        <Link className="flex items-center justify-center" href="/">
          <Bike className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Nombre</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <div className="space-x-4">
            {/* Botón de cambio de tema alineado a la derecha */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ml-4 focus:outline-none transition-transform duration-300 hover:scale-110 ${
                animateIcon ? 'rotate-animation' : ''
              }`}
            >
              {isDarkMode ? (
                <Sun className="text-foreground" size={24} />
              ) : (
                <Moon className="text-foreground" size={24} />
              )}
            </button>
            {isAuthenticated ? (
              <>
                <Link href="/home">
                  <Button variant="outline">Home</Button>
                </Link>
                <Button onClick={handleLogout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="outline">Regístrate</Button>
                </Link>
                <Link href="/login">
                  <Button>Inicia Sesión</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
