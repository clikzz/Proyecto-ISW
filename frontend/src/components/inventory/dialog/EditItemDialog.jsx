import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateItem } from '@/api/inventory';
import { Textarea } from '@/components/ui/textarea';
import { useAlert } from '@/context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { editItemValidation} from '@/validations/modifyItem';

const EditItemDialog = ({ isOpen, onClose, item, onUpdateItem }) => {
  const { showAlert } = useAlert();

  if (!item) return null;

  const handleFormikSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedFields = {};
      for (const key in values) {
        if (values[key] !== item[key]) {
          updatedFields[key] = values[key];
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        await updateItem(item.id_item, updatedFields);
        onUpdateItem();
        showAlert('Ítem actualizado correctamente', 'success');
      } else {
        showAlert('No se realizaron cambios.', 'info');
      }
      onClose();
    } catch (error) {
      console.error('Error al actualizar el ítem:', error);
      showAlert('Error al actualizar el ítem', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-card text-card-foreground max-w-2xl mx-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Producto</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name_item: item.name_item || '',
            category: item.category || '',
            stock: item.stock || 0,
            selling_price: item.selling_price || 0,
            description: item.description || '',
          }}
          validationSchema={editItemValidation}
          onSubmit={handleFormikSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Nombre</label>
                    <Field as={Input} name="name_item" placeholder="Nombre del producto" />
                    <ErrorMessage name="name_item" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Categoría</label>
                    <Select
                      value={values.category}
                      onValueChange={(value) => setFieldValue('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'Accesorios',
                          'Bicicletas',
                          'Componentes',
                          'Equipamiento',
                          'Electrónica',
                          'Herramientas',
                          'Limpieza',
                          'Repuestos',
                          'Otros',
                        ].map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Stock</label>
                    <Field as={Input} name="stock" placeholder="Stock disponible" />
                    <ErrorMessage name="stock" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Precio de Venta</label>
                    <Field as={Input} name="selling_price" type="number" placeholder="Precio de venta" />
                    <ErrorMessage name="selling_price" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Descripción</label>
                    <Field as={Textarea} name="description" placeholder="Descripción del producto" />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="mt-6 flex justify-end space-x-4">
                <Button type="button" onClick={onClose} variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;