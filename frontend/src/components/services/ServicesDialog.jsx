import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wrench } from 'lucide-react';
import { createService } from '@/api/service';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useAlert } from '@/context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { newServiceValidation } from '@/validations/newService';

export default function AddServiceDialog({ onAddService }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const newService = await createService(values);
      resetForm();
      onAddService(newService);
      setIsOpen(false);
      showAlert('Servicio agregado exitosamente', 'success');
    } catch (error) {
      console.error('Error al agregar servicio:', error.response?.data || error.message);
      showAlert('Ocurrió un error al agregar el servicio', 'error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Wrench className="mr-2 h-4 w-4" />
          Añadir Servicio
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name_service: '',
            description_service: '',
            price_service: '',
            category: '',
            payment_method_service: '',
          }}
          validationSchema={newServiceValidation} 
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="name_service">Nombre</Label>
                <Field
                  as={Input}
                  id="name_service"
                  name="name_service"
                  placeholder="Nombre del servicio"
                />
                <ErrorMessage
                  name="name_service"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description_service">Descripción</Label>
                <Field
                  as={Textarea}
                  id="description_service"
                  name="description_service"
                  placeholder="Descripción del servicio"
                />
                <ErrorMessage
                  name="description_service"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => setFieldValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reparación">Reparación</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="personalización">Personalización</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price_service">Precio</Label>
                <Field
                  as={Input}
                  id="price_service"
                  name="price_service"
                  type="number"
                  placeholder="Precio del servicio"
                />
                <ErrorMessage
                  name="price_service"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="payment_method_service">Método de Pago</Label>
                <Select
                  value={values.payment_method_service}
                  onValueChange={(value) =>
                    setFieldValue('payment_method_service', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="payment_method_service"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Botón Guardar */}
              <Button type="submit">Guardar</Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
