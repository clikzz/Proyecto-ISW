// components/Layout.jsx
import { Bike, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  // Sincronizar el estado de isDarkMode con localStorage y aplicar el tema desde el inicio
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

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const pageVariants = {
    hidden: { opacity: 0.5, y: 10, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0.5, y: -10, scale: 0.98, transition: { duration: 0.2 } },
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Script para cargar el tema antes del renderizado */}
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

      <div className="theme-transition min-h-screen overflow-hidden">
        <header className="absolute px-4 lg:px-6 h-14 flex items-center w-full z-10">
          <Link className="flex items-center justify-center" href="/">
            <Bike className="h-6 w-6" />
            <span className="ml-2 text-lg font-bold">bikefy</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-transform duration-300 hover:scale-110"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link href="/home">
                  <Button>Home</Button>
                </Link>
                <Button onClick={handleLogout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button>Regístrate</Button>
                </Link>
                <Link href="/login">
                  <Button>Inicia Sesión</Button>
                </Link>
              </>
            )}
          </nav>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={router.pathname} // Cambiado a pathname para evitar re-renders innecesarios
            variants={pageVariants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ type: 'spring', stiffness: 100 }}
            className="z-0"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </>
  );
}
