'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Wrench
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
  const [isExpanded, setIsExpanded] = useState(true);

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
        {isExpanded && <span>{children}</span>}
      </Link>
    );
  };

  return (
    <div className="bg-background text-foreground">
      <div
        className={`min-h-screen flex ${
          isExpanded ? 'ml-64' : 'ml-20'
        } transition-all duration-300`}
      >
        {/* Sidebar */}
        <aside
          className={`fixed left-8 top-8 bottom-8 rounded-3xl ${
            isExpanded ? 'w-64' : 'w-24'
          } bg-card p-6 flex flex-col items-center shadow-lg transition-all duration-300`}
        >
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Bike className="h-8 w-8 text-primary" />
            {isExpanded && (
              <span className="text-xl font-semibold">bikefy</span>
            )}
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
            <NavLink href="/inventario" icon={<Package className="h-6 w-6" />}>
              Inventario
            </NavLink>
            <NavLink href="/services" icon={<Wrench className="h-6 w-6" />}>
              Servicios
            </NavLink>
            {role === 'admin' && (
              <>
                <NavLink href="/users" icon={<Users className="h-6 w-6" />}>
                  Usuarios
                </NavLink>
                <NavLink href="/suppliers" icon={<Truck className="h-6 w-6" />}>
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
                logout();
              }}
              icon={<LogOut className="h-6 w-6" />}
            >
              Cerrar Sesion
            </NavLink>
          </nav>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-auto p-2 rounded-full hover:bg-accent"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between px-6">
            <div className="ml-auto flex items-center space-x-4">
              <ThemeToggle />
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
              className="flex-1 ml-8 overflow-y-auto p-6"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
