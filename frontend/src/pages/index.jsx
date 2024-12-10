'use client';

import { Bike, Wrench, Truck, Package, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
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
                  Revoluciona tu Taller de Bicicletas con <span className="text-primary">bikefy</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Optimiza tu negocio, aumenta la satisfacción de tus clientes y pedalea hacia el éxito con nuestra solución integral.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  width={400}
                  height={400}
                  className="rounded-full animate-float"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: Wrench,
                  title: "Servicios",
                  description: "Administra tus servicios, precios y categorías de manera eficiente."
                },
                {
                  icon: DollarSign,
                  title: "Balance Financiero",
                  description: "Visualiza tus ingresos, egresos y ganancias en un solo lugar."
                },
                {
                  icon: Package,
                  title: "Inventario",
                  description: "Administra tus productos, compras y ventas de manera sencilla."
                },
                {
                  icon: Truck,
                  title: "Proveedores",
                  description: "Administra tus proveedores y mantén un registro de tus compras."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 scale-fade-animation">
                    <CardHeader>
                      <feature.icon className="w-12 h-12 mb-4 text-primary" />
                      <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </motion.main>

      <footer className="w-full py-6 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bike className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">bikefy</span>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Términos</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacidad</Link>
              <p>Desarrollado por:</p>
              <Link href="https://www.linkedin.com/in/alvaroloyola/" target="_blank" className="hover:text-primary transition-colors">
                Álvaro
              </Link>
              <Link href="https://www.linkedin.com/in/rociorivastp/" target="_blank" className="hover:text-primary transition-colors">
                Rocío
              </Link>
              <Link href="https://www.linkedin.com/in/anaissaldiasn/" target="_blank" className="hover:text-primary transition-colors">
                Anaís
              </Link>
              <Link href="https://www.linkedin.com/in/alejandro-yanez-oyarce/" target="_blank" className="hover:text-primary transition-colors">
                Alejandro
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
