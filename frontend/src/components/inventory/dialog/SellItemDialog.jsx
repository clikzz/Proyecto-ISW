import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';
import { useAlert } from '@/context/alertContext';
import { getInventoryItems, recordSale } from '@/api/inventory';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { capitalize } from '@/helpers/capitalize';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { sellItemValidation } from '@/validations/newSale';

export default function SellItemDialog({ fetchSales }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (isDialogOpen) {
      const fetchItems = async () => {
        try {
          const data = await getInventoryItems();
          setItems(data);
        } catch (error) {
          console.error('Error al obtener los ítems:', error);
        }
      };
      fetchItems();
    }
  }, [isDialogOpen]);

  const handleFormikSubmit = async (values, { setSubmitting, resetForm }) => {
    const selectedItem = items.find((item) => item.id_item === parseInt(values.selectedItem));
    const total = selectedItem.selling_price * values.quantity;

    const transaction = {
      type: 'venta',
      items: [
        {
          id_item: selectedItem.id_item,
          quantity: values.quantity,
          unit_price: selectedItem.selling_price,
        },
      ],
      details: {
        amount: total,
        payment_method: values.paymentMethod.toLowerCase(),
        description: `Venta de ${values.quantity} unidades de ${selectedItem.name_item}`,
      },
    };

    try {
      console.log('Transacción enviada:', transaction);
      await recordSale(transaction);
      showAlert('Venta registrada exitosamente', 'success');
      setIsDialogOpen(false);
      resetForm();
      fetchSales();
    } catch (error) {
      console.error('Error al registrar la venta:', error.message);
      showAlert(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Handshake size="16" />
          Registrar Venta
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Formulario de Venta</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            selectedItem: '',
            quantity: 1,
            paymentMethod: '',
          }}
          validationSchema={sellItemValidation}
          onSubmit={handleFormikSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            const selectedItem = items.find(
              (item) => item.id_item === parseInt(values.selectedItem)
            );
            const total = selectedItem ? selectedItem.selling_price * values.quantity : 0;

            return (
              <Form className="space-y-4">
                {/* Producto */}
                <div>
                  <Label>Producto</Label>
                  <Select
                    value={values.selectedItem}
                    onValueChange={(value) => setFieldValue('selectedItem', value)}
                  >
                    <SelectTrigger>
                      {selectedItem
                        ? `${selectedItem.name_item} - $${selectedItem.selling_price}`
                        : 'Selecciona un producto'}
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id_item} value={item.id_item.toString()}>
                          {item.name_item} - ${item.selling_price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="selectedItem"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Cantidad */}
                <div>
                  <Label>Cantidad</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="quantity"
                    min={1}
                    placeholder="Cantidad"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Método de Pago */}
                <div>
                  <Label>Método de Pago</Label>
                  <Select
                    value={values.paymentMethod}
                    onValueChange={(value) => setFieldValue('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      {capitalize(values.paymentMethod) || 'Selecciona un método'}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="paymentMethod"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Monto Total */}
                <div>
                  <Label>Monto Total</Label>
                  <Input value={`$${total.toLocaleString('es-CL')}`} readOnly />
                </div>

                {/* Botón de Confirmar */}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-500 text-white" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Confirmar Venta'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}