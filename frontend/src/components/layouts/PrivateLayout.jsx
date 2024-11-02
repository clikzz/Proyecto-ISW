'use client';

import React, { useState, useEffect } from 'react';
import {
  Bike,
  Sun,
  Moon,
  Bell,
  Home,
  Package,
  User,
  LogOut,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import Notificaciones from '@components/Notification';

export default function Layout2({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    logout();
  };

  const pageVariants = {
    hidden: { opacity: 0.5, y: 10, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0.5, y: -10, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <>
      <Script
        id="theme-loader"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme');
              if (theme) {
                document.documentElement.classList.add(theme);
              }
            })();
          `,
        }}
      />

      <div className="theme-transition min-h-screen flex bg-background text-foreground ml-[calc(16rem+4rem)]">
        {/* Sidebar */}
        <aside className="fixed top-8 left-8 h-[calc(100vh-4rem)] w-64 bg-card p-6 flex flex-col items-center rounded-3xl shadow-lg">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Bike className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">bikefy</span>
          </Link>

          <nav className="space-y-4 w-full">
            <Link
              href="/home"
              className="flex items-center space-x-3 p-3 rounded-full hover:bg-accent transition-all"
            >
              <Home className="h-6 w-6" />
              <span>Home</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center space-x-3 p-3 rounded-full hover:bg-accent transition-all"
            >
              <User className="h-6 w-6" />
              <span>Perfil</span>
            </Link>
            <Link
              href="/employees"
              className="flex items-center space-x-3 p-3 rounded-full hover:bg-accent transition-all"
            >
              <Users className="h-6 w-6" />
              <span>Empleados</span>
            </Link>
            <Link
              href="/inventarios"
              className="flex items-center space-x-3 p-3 rounded-full hover:bg-accent transition-all"
            >
              <Package className="h-6 w-6" />
              <span>Inventarios</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-full hover:bg-accent transition-all w-full"
            >
              <LogOut className="h-6 w-6" />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-end px-6">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-accent"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <Notificaciones>
              <button className="p-2 rounded-full hover:bg-accent">
                <Bell size={24} />
              </button>
            </Notificaciones>
          </header>

          <AnimatePresence mode="wait">
            <motion.main
              key={router.pathname}
              variants={pageVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
              className="flex-1 overflow-y-auto p-6 relative"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
