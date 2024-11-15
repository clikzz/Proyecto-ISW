'use client';

import React, { useEffect } from 'react';
import {
  Bike,
  Bell,
  Home,
  Package,
  User,
  LogOut,
  Users,
  Truck,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import Notificaciones from '@/components/Notification';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

export default function PrivateLayout({ children }) {
  const router = useRouter();
  const { logout, isAuthenticated, role, loading } = useAuth();

  const pageVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.95,
      transition: { duration: 0.5, ease: 'easeIn' },
    },
  };
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const NavLink = ({ href, icon, children, onClick }) => {
    const isActive = router.pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 rounded-full transition-all ${
          isActive
            ? 'bg-accent text-white hover:bg-accent hover:text-white'
            : 'hover:bg-accent hover:text-white'
        }`}
      >
        {React.cloneElement(icon, {
          className: `${icon.props.className} ${isActive ? 'text-white' : ''}`,
        })}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <>
      <div className="bg-background text-foreground">
        <div className="min-h-screen flex ml-[calc(16rem+4rem)]">
          {/* Sidebar */}
          <aside className="fixed top-8 left-8 h-[calc(100vh-4rem)] w-64 bg-card p-6 flex flex-col items-center rounded-3xl shadow-lg">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <Bike className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">bikefy</span>
            </Link>

            <nav className="space-y-4 w-full">
              <NavLink href="/home" icon={<Home className="h-6 w-6" />}>
                Home
              </NavLink>
              {role === 'admin' && (
                <NavLink
                  href="/overview"
                  icon={<TrendingUp className="h-6 w-6" />}
                >
                  Overview
                </NavLink>
              )}
              <NavLink
                href="/inventario"
                icon={<Package className="h-6 w-6" />}
              >
                Inventario
              </NavLink>
              {role === 'admin' && (
                <>
                  <NavLink href="/users" icon={<Users className="h-6 w-6" />}>
                    Usuarios
                  </NavLink>
                  <NavLink
                    href="/suppliers"
                    icon={<Truck className="h-6 w-6" />}
                  >
                    Proveedores
                  </NavLink>
                  <NavLink
                    href="/finanzas"
                    icon={<DollarSign className="h-6 w-6" />}
                  >
                    Finanzas
                  </NavLink>
                </>
              )}
              <NavLink href="/profile" icon={<User className="h-6 w-6" />}>
                Perfil
              </NavLink>
              <NavLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                icon={<LogOut className="h-6 w-6" />}
              >
                Cerrar Sesion
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center justify-between px-6">
              <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle></ThemeToggle>
                <Notificaciones>
                  <button
                    className="p-2 rounded-full hover:bg-accent"
                    aria-label="Notificaciones"
                  >
                    <Bell size={24} />
                  </button>
                </Notificaciones>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.main
                key={router.pathname}
                variants={pageVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
                className="flex-1 overflow-y-auto p-6"
              >
                {children}
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
