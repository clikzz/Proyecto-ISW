'use client';

import { Bike, Wrench, Calendar, BarChart, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/authContext';

export default function LandingPage() {
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

  return (
    <div className="overflow-hidden min-h-screen bg-background text-foreground">
      <header className="fixed px-4 lg:px-6 h-14 flex items-center w-full z-10 bg-background/80 backdrop-blur-sm">
        <Link className="flex items-center justify-center" href="/">
          <Bike className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">bikefy</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          <Link href="#features" className="hidden md:inline-block hover:text-primary transition-colors">
            Características
          </Link>
          <Link href="#testimonials" className="hidden md:inline-block hover:text-primary transition-colors">
            Testimonios
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/home">
                <Button className="rounded-xl">Home</Button>
              </Link>
              <Button className="rounded-xl" onClick={logout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="rounded-xl">Inicia Sesión</Button>
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </header>

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
                  <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                    Prueba Gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="rounded-xl">Ver Demo</Button>
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
                  alt="Ilustración de un taller de bicicletas moderno"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Wrench, title: "Gestión de Reparaciones", description: "Organiza y realiza un seguimiento de todas las reparaciones de manera eficiente." },
                { icon: Calendar, title: "Programación Inteligente", description: "Optimiza tu calendario de trabajo y reduce los tiempos de espera." },
                { icon: BarChart, title: "Análisis y Reportes", description: "Obtén insights valiosos sobre el rendimiento de tu taller." }
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

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Lo que Dicen Nuestros Clientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Johanna Olivares", role: "Dueña de Taller", content: "bikefy ha transformado completamente la forma en que gestionamos nuestro taller." },
                { name: "Nicole Ibieta", role: "Gerente de Tienda", content: "bikefy nos ha permitido optimizar nuestro tiempo y recursos." },
                { name: "Cristina Betancurt", role: "Técnica de Bicicletas", content: "Los análisis y reportes de bikefy me han ayudado a identificar áreas de mejora en mi trabajo." }
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
                          <Star key={i} className="text-yellow-400 w-5 h-5" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <Image
                          src={`/placeholder.svg?height=40&width=40&text=👤`}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="rounded-full mr-4"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                ¿Listo para Revolucionar tu Taller?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Únete a los cientos de talleres que ya están optimizando su negocio con bikefy.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                    placeholder="Ingresa tu email"
                    type="email"
                  />
                  <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">Suscribirse</Button>
                </form>
              </div>
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

