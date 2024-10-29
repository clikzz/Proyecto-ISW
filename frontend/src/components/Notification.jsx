'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Notificaciones({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      <div onClick={toggleNotifications}>
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={notificationRef}
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 mt-2 w-96 bg-card shadow-lg rounded-lg overflow-hidden z-50"
          >
            <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
              <h3 className="font-semibold">Notificaciones</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:text-accent-foreground"
                aria-label="Cerrar notificaciones"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 min-h-[200px]"> {/* Agregado min-h-[200px] para más espacio */}
              <p className="text-center text-muted-foreground">No hay notificaciones nuevas</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
