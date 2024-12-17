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

const ItemDetailsDialog = ({ isOpen, onClose, item, onEdit }) => {
  if (!item) return null;

  const initialValues = {
    name_item: item.name_item || '',
    category: item.category || '',
    stock: item.stock || 0,
    selling_price: item.selling_price || 0,
    suppliers: item.suppliers || [],
    description: item.description || '',
  };

  const handleSubmit = (values) => {
    onEdit({ ...item, ...values });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-card text-card-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">
            Detalles del Producto
          </DialogTitle>
        </DialogHeader>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form>
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Nombre</label>
                    <Field
                      as={Input}
                      name="name_item"
                      disabled
                      value={capitalize(values.name_item)}
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
                    <label className="block text-sm font-semibold">Stock</label>
                    <Field
                      as={Input}
                      type="number"
                      name="stock"
                    />
                    <ErrorMessage name="stock" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Precio de Venta</label>
                    <Field
                      as={Input}
                      type="text"
                      name="selling_price"
                      value={`$ ${Number(values.selling_price).toLocaleString('es-CL')}`}
                    />
                    <ErrorMessage name="selling_price" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Proveedores</label>
                    <Field name="suppliers">
                      {({ field }) => (
                        <div className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground dark:text-card-foreground dark:bg-background">
                          {Array.isArray(field.value) && field.value.length > 0 ? (
                            field.value.map((supplier, index) => (
                              <p key={index} className="block text-sm">
                                {supplier.name_supplier || 'No Registrado'}
                              </p>
                            ))
                          ) : (
                            <p className="text-gray-400">No Registrado</p>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Descripción</label>
                    <Field
                      as={Textarea}
                      name="description"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Fecha de registro */}
              <div className="mt-6 flex justify-between items-center text-sm space-x-4">
                <p>
                  Registrado el{' '}
                  <span className="font-semibold">{formatDateTime(item.created_at)}</span>
                </p>
                <p>
                  Modificado por última vez el{' '}
                  <span className="font-semibold">{formatDateTime(item.updated_at)}</span>
                </p>
                {/* Botón para Editar */}
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  type="submit"
                >
                  Editar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;