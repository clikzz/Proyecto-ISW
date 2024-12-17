import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { capitalize } from '@/helpers/capitalize';
import { Button } from '@/components/ui/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { newServiceValidation } from '@/validations/newService';

const ServiceDetailsDialog = ({ isOpen, onClose, service, onEdit }) => {
  useEffect(() => {
    if (service) {
    }
  }, [service]);

  if (!service) {
    return null;
  }

  const formatDateTime = (date) => {
    if (!date) return 'Fecha no disponible';
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleString('es-ES', options);
  };

  const handleEditClick = () => {
    onClose(); 
    onEdit(service); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detalles del Servicio</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name_service: service.name_service || '',
            description_service: service.description_service || '',
            price_service: service.price_service || '',
            category: service.category || '',
            payment_method_service: service.payment_method_service || '',
          }}
          validationSchema={newServiceValidation}
          onSubmit={(values) => {
            console.log('Formulario validado:', values);
          }}
        >
          <Form className="space-y-4">
            <FieldDisplay
              label="Nombre"
              name="name_service"
              value={capitalize(service.name_service)}
            />
            <FieldDisplay
              label="Descripción"
              name="description_service"
              value={service.description_service || 'Sin descripción'}
            />
            <FieldDisplay
              label="Precio"
              name="price_service"
              value={`$${service.price_service}`}
            />
            <FieldDisplay
              label="Categoría"
              name="category"
              value={capitalize(service.category)}
            />
            <FieldDisplay
              label="Método de Pago"
              name="payment_method_service"
              value={capitalize(service.payment_method_service || 'Sin definir')}
            />

            {/* Fechas */}
            <div className="mt-6 flex justify-between items-center text-sm space-x-4">
              <p>
                Registrado el{' '}
                <span className="font-semibold">{formatDateTime(service.created_at)}</span>
              </p>
              <p>
                Modificado el{' '}
                <span className="font-semibold">{formatDateTime(service.updated_at)}</span>
              </p>
            </div>

            {/* Botón Editar */}
            <div className="flex justify-end mt-6">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                type="button"
                onClick={handleEditClick}
              >
                Editar
              </Button>
            </div>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const FieldDisplay = ({ label, name, value }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-muted-foreground">
      {label}
    </label>
    <Field
      name={name}
      value={value}
      disabled
      className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-not-allowed"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export default ServiceDetailsDialog;
