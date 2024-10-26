// components/Layout.js
import { Bike } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';

export default function Layout({ children }) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div>
      <header className="absolute px-4 lg:px-6 h-14 flex items-center justify-between w-full">
        <Link className="flex items-center justify-center" href="/">
          <Bike className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Nombre</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <div className="space-x-4">
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
