// components/Layout.jsx
import { Bike, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const pageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.98 // Añade un efecto de escala sutil
    },
    enter: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.6, // Ajusta la duración
        ease: [0.25, 0.46, 0.45, 0.94] // Curva de animación más suave
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98, 
      transition: { 
        duration: 0.4, 
        ease: [0.42, 0, 0.58, 1] 
      }
    }
  };

  return (
    <div className="theme-transition min-h-screen overflow-hidden">
      <header className="absolute px-4 lg:px-6 h-14 flex items-center w-full z-10">
        <Link className="flex items-center justify-center" href="/">
          <Bike className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Nombre</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-transform duration-300 hover:scale-110 ${
              animateIcon ? 'rotate-animation' : ''
            }`}
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
          key={router.asPath}
          variants={pageVariants}
          initial="hidden"
          animate="enter"
          exit="exit"
          transition={{ type: 'spring', stiffness: 100 }}
          className="z-0" // Asegura que no se superponga al header o botones
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
