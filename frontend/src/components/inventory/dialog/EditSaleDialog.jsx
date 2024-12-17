import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { updateSale } from '@/api/inventory';
import { useAlert } from '@/context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { editSaleValidation } from '@/validations/modifySale';
import { Button } from "@components/ui/button";

const EditSaleDialog = ({ isOpen, onClose, sale, onUpdateSale }) => {
  const { showAlert } = useAlert();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (sale) {
      setTotal(sale.quantity_item * sale.unit_price);
    }
  }, [sale]);

  if (!sale) return null;

  const generateDescription = (quantity, productName) => {
    return `Venta de ${quantity || 1} unidades de ${productName || 'producto'}`;
  };

  const handleFormikSubmit = async (values, { setSubmitting }) => {
    try {
      const unitPrice = sale.unit_price || values.unit_price;
      const totalAmount = values.quantity_item * unitPrice;

      const updatedFields = {
        items: [
          {
            id_transaction_item: sale.id_transaction_item,
            quantity_item: values.quantity_item,
            unit_price: unitPrice,
          },
        ],
        details: {
          amount: totalAmount,
          payment_method: values.payment_method,
          description: values.description,
        },
      };

      await updateSale(sale.id_transaction, updatedFields);
      onUpdateSale(updatedFields);
      showAlert('Venta actualizada correctamente', 'success');
      onClose();
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
      showAlert('Error al actualizar la venta', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-card text-card-foreground max-w-2xl mx-auto p-8">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">
            Editar Venta
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            payment_method: sale.payment_method || '',
            quantity_item: sale.quantity_item || 1,
            description: sale.description || generateDescription(sale.quantity_item, sale.name_item),
          }}
          validationSchema={editSaleValidation}
          onSubmit={handleFormikSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => {
            useEffect(() => {
              setTotal(values.quantity_item * sale.unit_price);
              setFieldValue(
                'description',
                generateDescription(values.quantity_item, sale.name_item)
              );
            }, [values.quantity_item]);

            return (
              <Form>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* Columna izquierda */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold">
                        Producto
                      </label>
                      <Input
                        value={`${sale.name_item} - $${sale.unit_price}`}
                        readOnly
                        className="p-2 border rounded-md w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold">
                        Método de Pago
                      </label>
                      <Select
                        value={values.payment_method}
                        onValueChange={(value) => setFieldValue('payment_method', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                          <SelectItem value="tarjeta">Tarjeta</SelectItem>
                          <SelectItem value="transferencia">Transferencia</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="payment_method"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold">
                        Cantidad Vendida
                      </label>
                      <Field
                        as={Input}
                        type="number"
                        name="quantity_item"
                        min={1}
                        className="p-2 border rounded-md w-full"
                      />
                      <ErrorMessage
                        name="quantity_item"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold">
                        Monto Total
                      </label>
                      <Input
                        value={`$${total.toLocaleString('es-CL')}`}
                        readOnly
                        className="p-2 border rounded-md w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold">
                        Descripción
                      </label>
                      <Field
                        as={Textarea}
                        name="description"
                        className="p-2 border rounded-md w-full"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
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

export default EditSaleDialog;