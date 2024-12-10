'use client';

import { useState } from 'react';
import {
  Bike,
  Wrench,
  BarChart2,
  Package,
  Users,
  ChevronDown,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    icon: Wrench,
    title: 'Gestión de Servicios',
    description: 'Organiza reparaciones y mantenimientos de forma eficiente.',
  },
  {
    icon: BarChart2,
    title: 'Análisis Financiero',
    description: 'Visualiza ingresos, gastos y ganancias en tiempo real.',
  },
  {
    icon: Package,
    title: 'Control de Inventario',
    description: 'Gestiona piezas y accesorios con facilidad.',
  },
  {
    icon: Users,
    title: 'Gestión de Proveedores',
    description:
      'Mantén un registro detallado de tus proveedores y sus productos.',
  },
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

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

  return (
    <div className="overflow-hidden min-h-screen bg-background text-foreground">
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: 'spring', stiffness: 100 }}
        className="pt-14"
      >
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Revoluciona tu Taller de Bicicletas con{' '}
                  <span className="text-primary">bikefy</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Optimiza tu negocio, aumenta la satisfacción de tus clientes y
                  pedalea hacia el strong con nuestra solución integral.
                </p>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Image
                  src="/xd.png"
                  width={400}
                  height={400}
                  className="rounded-full animate-float"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ChevronDown className="w-10 h-10 mx-auto text-gray-600 animate-bounce" />
        </motion.div>
      </motion.main>

      <section
        id="características"
        className="py-20"
        style={{ backgroundColor: 'hsl(var(--muted))' }}
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-16"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Características Principales
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    activeFeature === index ? 'shadow-md' : 'hover:shadow-lg'
                  }`}
                  style={{
                    backgroundColor: `hsl(var(${
                      activeFeature === index
                        ? document.documentElement.classList.contains('dark')
                          ? '220, 40%, 30%'
                          : '210, 80%, 90%'
                        : '--card'
                    }))`,
                    color: `hsl(var(${
                      activeFeature === index
                        ? document.documentElement.classList.contains('dark')
                          ? '220, 60%, 70%'
                          : '210, 50%, 20%'
                        : '--card-foreground'
                    }))`,
                  }}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <feature.icon className="w-8 h-8" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p
                    className="mt-2"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
            <div
              className="relative h-[400px] rounded-lg overflow-hidden"
              style={{ backgroundColor: 'hsl(var(--muted))' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
                  style={{ color: 'hsl(var(--primary))' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  {features[activeFeature].title}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-6 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bike className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">bikefy</span>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Términos
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacidad
              </Link>
              <p>Desarrollado por:</p>
              <Link
                href="https://www.linkedin.com/in/alvaroloyola/"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                Álvaro
              </Link>
              <Link
                href="https://www.linkedin.com/in/rociorivastp/"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                Rocío
              </Link>
              <Link
                href="https://www.linkedin.com/in/anaissaldiasn/"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                Anaís
              </Link>
              <Link
                href="https://www.linkedin.com/in/alejandro-yanez-oyarce/"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                Alejandro
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
