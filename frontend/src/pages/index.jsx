'use client';

import { useState } from 'react';
import {
  Bike,
  Wrench,
  BarChart2,
  Package,
  Users,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const Star = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M12 .587l3.668 7.431L24 9.751l-6 5.851 1.417 8.333L12 18.771l-7.417 3.964L6 15.602 0 9.751l8.332-1.733z" />
  </svg>
);

const features = [
  {
    icon: Wrench,
    title: 'Gestión de Servicios',
    description: 'Organiza reparaciones y mantenimientos de forma eficiente.',
    imageLight: '/images/service-light.png',
    imageDark: '/images/service-dark.png',
  },
  {
    icon: BarChart2,
    title: 'Análisis Financiero',
    description: 'Visualiza ingresos, gastos y ganancias en tiempo real.',
    imageLight: '/images/finance-light.png',
    imageDark: '/images/finance-dark.png',
  },
  {
    icon: Package,
    title: 'Control de Inventario',
    description: 'Gestiona piezas y accesorios con facilidad.',
    imageLight: '/images/inventory-light.png',
    imageDark: '/images/inventory-dark.png',
  },
  {
    icon: Users,
    title: 'Gestión de Proveedores',
    description:
      'Mantén un registro detallado de tus proveedores y sus productos.',
    imageLight: '/images/supplier-light.png',
    imageDark: '/images/supplier-dark.png',
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
                  pedalea hacia el <strong>éxito</strong> con nuestra solución integral.
                </p>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Image
                  src="/bodoque.gif"
                  width={400}
                  height={400}
                  className="rounded-full animate-float"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <motion.div
          className="mt-28"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ChevronDown className="w-10 h-10 mx-auto text-gray-600 animate-bounce" />
        </motion.div>
      </motion.main>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Lo que Dicen Nuestros Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Johanna Olivares',
                role: 'Dueña de Taller',
                content:
                  '<strong>bikefy</strong> ha transformado completamente la forma en que gestionamos nuestro taller.',
                image: '/johanna.png',
              },
              {
                name: 'Nicole Ibieta',
                role: 'Gerente de Tienda',
                content:
                  '<strong>bikefy</strong> nos ha permitido optimizar nuestro tiempo y recursos.',
                image: '/nicole.png',
              },
              {
                name: 'Cristina Betancurt',
                role: 'Técnica de Bicicletas',
                content:
                  'Los análisis y reportes de <strong>bikefy</strong> me han ayudado a identificar áreas de mejora en mi trabajo.',
                image: '/cristina.png',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 w-5 h-5 " />
                      ))}
                    </div>
                    <p
                      className="text-muted-foreground mb-4 italic"
                      dangerouslySetInnerHTML={{ __html: testimonial.content }}
                    />
                    <div className="flex items-center">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="características"
        className="py-20"
        style={{ backgroundColor: 'hsl(var(--muted))' }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Características Principales
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Lista de características */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    activeFeature === index
                      ? 'shadow-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Imagen dinámica */}
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  className="absolute w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Imagen para modo claro */}
                  <Image
                    src={features[activeFeature].imageLight}
                    alt={features[activeFeature].title}
                    width={800}
                    height={500}
                    objectFit="contain"
                    className="block dark:hidden rounded-2xl"
                  />
                  {/* Imagen para modo oscuro */}
                  <Image
                    src={features[activeFeature].imageDark}
                    alt={features[activeFeature].title}
                    width={800}
                    height={500}
                    objectFit="contain"
                    className="hidden dark:block rounded-2xl"
                  />
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
