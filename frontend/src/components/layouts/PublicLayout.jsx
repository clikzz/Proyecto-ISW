'use client';

import { Bike } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';
import { useAuth } from '@context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@components/ThemeToggle';

export default function Layout({ children }) {
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
        <header className="fixed px-4 lg:px-6 h-14 flex items-center w-full z-10 bg-background/80 backdrop-blur-sm">
          <Link className="flex items-center justify-center" href="/">
            <Bike className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">bikefy</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/home">
                    <Button className="rounded-xl">Home</Button>
                  </Link>
                  <Button className="rounded-xl" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="rounded-xl">Inicia Sesión</Button>
                  </Link>
                </>
              )}
              <ThemeToggle></ThemeToggle>
            </div>
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
