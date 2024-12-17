import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateService } from '@/api/service';
import { useAlert } from '@/context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { newServiceValidation } from '@/validations/newService';

const EditServiceDialog = ({ isOpen, onClose, service, onUpdateService }) => {
  const { showAlert } = useAlert();

  const handleSubmit = async (values) => {
    try {
      const updatedFields = Object.keys(values).reduce((changes, key) => {
        if (values[key] !== service[key]) {
          changes[key] = values[key];
        }
        return changes;
      }, {});

      if (Object.keys(updatedFields).length === 0) {
        showAlert('No hay cambios para guardar.', 'info');
        return;
      }

      const response = await updateService(service.id_service, updatedFields);
      onUpdateService(response);
      showAlert('Servicio actualizado correctamente.', 'success');
      onClose();
    } catch (error) {
      showAlert('Error al actualizar el servicio.', 'error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Servicio</DialogTitle>
        </DialogHeader>

        {service && (
          <Formik
            initialValues={{
              name_service: service.name_service || '',
              description_service: service.description_service || '',
              price_service: service.price_service || '',
              category: service.category || '',
              payment_method_service: service.payment_method_service || '',
            }}
            validationSchema={newServiceValidation}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="name_service">Nombre</label>
                  <Field
                    as={Input}
                    name="name_service"
                    id="name_service"
                    placeholder="Nombre del servicio"
                  />
                  <ErrorMessage
                    name="name_service"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="category">Categoría</label>
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

                {/* Método de Pago */}
                <div>
                  <label htmlFor="payment_method_service">Método de Pago</label>
                  <Select
                    value={values.payment_method_service}
                    onValueChange={(value) => setFieldValue('payment_method_service', value)}
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

                {/* Precio */}
                <div>
                  <label htmlFor="price_service">Precio</label>
                  <Field
                    as={Input}
                    type="number"
                    name="price_service"
                    id="price_service"
                    placeholder="Precio del servicio"
                  />
                  <ErrorMessage
                    name="price_service"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="description_service">Descripción</label>
                  <Field
                    as={Textarea}
                    name="description_service"
                    id="description_service"
                    placeholder="Descripción del servicio"
                  />
                  <ErrorMessage
                    name="description_service"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Guardar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
