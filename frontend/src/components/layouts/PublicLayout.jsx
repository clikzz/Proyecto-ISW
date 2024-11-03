import { Bike, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';
import { useAuth } from '@context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@context/themeContext';

export default function Layout({ children }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <div className="overflow-hidden min-h-screen bg-background text-foreground ${className}">
        <header className="fixed px-4 lg:px-6 h-14 flex items-center w-full z-10">
          <Link className="flex items-center justify-center" href="/">
            <Bike className="h-6 w-6" />
            <span className="ml-2 text-lg font-bold">bikefy</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/home">
                  <Button>Home</Button>
                </Link>
                <Button onClick={handleLogout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button>Inicia Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button>Regístrate</Button>
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-accent"
              aria-label={
                isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'
              }
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </nav>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={router.pathname}
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
