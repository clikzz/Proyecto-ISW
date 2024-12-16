import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/context/alertContext';
import { updatePurchase } from '@/api/inventory';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { editPurchaseValidation } from '@/validations/modifyPurchase';

const EditPurchaseDialog = ({ isOpen, onClose, purchase, onUpdatePurchase }) => {
  const [total, setTotal] = useState(0);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (purchase) {
      setTotal(purchase.quantity_item * purchase.unit_price);
    }
  }, [purchase]);

  const generateDescription = (quantity, productName) => {
    return `Compra de ${quantity || 1} unidades de ${productName || 'producto'}`;
  };

  const handleFormikSubmit = async (values, { setSubmitting }) => {
    try {
      const totalAmount = values.quantity_item * values.unit_price;

      const updatedFields = {
        items: [
          {
            id_transaction_item: purchase.id_transaction_item,
            quantity_item: values.quantity_item,
            unit_price: values.unit_price,
          },
        ],
        details: {
          amount: totalAmount,
          payment_method: values.payment_method,
          description: values.description,
        },
      };

      const response = await updatePurchase(purchase.id_transaction, updatedFields);
      if (response) {
        onUpdatePurchase(response);
        showAlert('Compra actualizada correctamente', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error al actualizar la compra:', error);
      showAlert('Error al actualizar la compra', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!purchase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Editar Compra</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            quantity_item: purchase.quantity_item || 1,
            unit_price: purchase.unit_price || 0,
            payment_method: purchase.payment_method || '',
            description: generateDescription(purchase.quantity_item, purchase.name_item),
          }}
          validationSchema={editPurchaseValidation}
          onSubmit={handleFormikSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            useEffect(() => {
              setTotal(values.quantity_item * values.unit_price);
              setFieldValue(
                'description',
                generateDescription(values.quantity_item, purchase.name_item)
              );
            }, [values.quantity_item, values.unit_price]);

            return (
              <Form className="space-y-4">
                {/* Producto (Solo lectura) */}
                <div>
                  <label className="block text-sm font-medium">Producto</label>
                  <Input value={purchase.name_item} readOnly/>
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-medium">Cantidad</label>
                  <Field
                    as={Input}
                    type="number"
                    name="quantity_item"
                    min={1}
                    placeholder="Cantidad"
                  />
                  <ErrorMessage name="quantity_item" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Precio Unitario */}
                <div>
                  <label className="block text-sm font-medium">Precio Unitario</label>
                  <Field
                    as={Input}
                    type="number"
                    name="unit_price"
                    min={0}
                    placeholder="Precio Unitario"
                  />
                  <ErrorMessage name="unit_price" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm font-medium">Método de Pago</label>
                  <Select
                    value={values.payment_method}
                    onValueChange={(value) => setFieldValue('payment_method', value)}
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
                  <ErrorMessage name="payment_method" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Monto Total */}
                <div>
                  <label className="block text-sm font-medium">Monto Total</label>
                  <Input value={`$${total?.toLocaleString('es-CL')}`} readOnly/>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium">Descripción</label>
                  <Field as={Textarea} name="description" placeholder="Descripción" />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Botones */}
                <div className="mt-6 flex justify-end space-x-4">
                  <Button type="button" variant="destructive" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditPurchaseDialog;