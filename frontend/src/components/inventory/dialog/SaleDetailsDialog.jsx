import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SaleDetailsDialog = ({ isOpen, onClose, onEdit, sale }) => {
  if (!sale) return null;

  const initialValues = {
    name_item: sale.name_item || '',
    category: sale.category || '',
    payment_method: sale.payment_method || '',
    quantity_item: sale.quantity_item || 0,
    amount: sale.amount || 0,
    description: sale.description || '',
  };

  const handleSubmit = (values) => {
    onEdit({ ...sale, ...values });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-card text-card-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">Detalles de la Venta</DialogTitle>
        </DialogHeader>

        {/* Formik para el formulario */}
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Producto</label>
                    <Field
                      as={Input}
                      name="name_item"
                      placeholder="Nombre del producto"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Categoría</label>
                    <Field
                      as={Input}
                      name="category"
                      placeholder="Categoría"
                      disabled
                      value={capitalize(values.category)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Método de Pago</label>
                    <Field
                      as={Input}
                      name="payment_method"
                      placeholder="Método de Pago"
                      disabled
                      value={capitalize(values.payment_method)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Cantidad vendida</label>
                    <Field
                      as={Input}
                      type="number"
                      name="quantity_item"
                      placeholder="Cantidad vendida"
                    />
                    <ErrorMessage name="quantity_item" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Monto Total</label>
                    <Field
                      as={Input}
                      type="text"
                      name="amount"
                      placeholder="Monto Total"
                      value={`$ ${Number(values.amount).toLocaleString('es-CL')}`}
                      disabled
                    />
                    <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Descripción</label>
                    <Field
                      as={Textarea}
                      name="description"
                      placeholder="Descripción"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-sm space-x-4">
                <p>
                  Registrado el{' '}
                  <span className="font-semibold">{formatDateTime(sale.transaction_date)}</span>
                </p>
                <p>
                  Modificado el{' '}
                  <span className="font-semibold">{formatDateTime(sale.updated_at)}</span>
                </p>
                <Button type="submit">Editar</Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailsDialog;