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

const PurchaseDetailsDialog = ({ isOpen, onClose, onEdit, purchase }) => {
  if (!purchase) return null;

  const initialValues = {
    name_item: purchase.name_item || '',
    category: purchase.category || '',
    payment_method: purchase.payment_method || '',
    quantity_item: purchase.quantity_item || 0,
    amount: purchase.amount || 0,
    name_supplier: purchase.name_supplier || '',
    description: purchase.description || '',
  };

  const handleSubmit = (values) => {
    onEdit({ ...purchase, ...values });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-card text-card-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">Detalles de la Compra</DialogTitle>
        </DialogHeader>

        {/* Formik Form */}
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form>
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Producto</label>
                    <Field
                      as={Input}
                      name="name_item"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Categoría</label>
                    <Field
                      as={Input}
                      name="category"
                      disabled
                      value={capitalize(values.category)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Método de Pago</label>
                    <Field
                      as={Input}
                      name="payment_method"
                      disabled
                      value={capitalize(values.payment_method)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Cantidad comprada</label>
                    <Field
                      as={Input}
                      type="number"
                      name="quantity_item"
                      disabled
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
                      value={`$${Number(values.amount).toLocaleString('es-CL')}`}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Proveedor</label>
                    <Field
                      as={Input}
                      name="name_supplier"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Descripción</label>
                    <Field
                      as={Textarea}
                      name="description"
                      disabled
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-sm space-x-4">
                <p>
                  Registrado el{' '}
                  <span className="font-semibold">{formatDateTime(purchase.transaction_date)}</span>
                </p>
                <p>
                  Modificado el{' '}
                  <span className="font-semibold">{formatDateTime(purchase.updated_at)}</span>
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

export default PurchaseDetailsDialog;