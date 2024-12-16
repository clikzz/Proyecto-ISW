import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { capitalize } from '@/helpers/capitalize';
import { newPurchaseValidationExisting } from '@/validations/newPurchase';

export default function ExistingPurchaseForm({
  purchaseDetails,
  setPurchaseDetails,
  items,
  selectedSupplier,
  setSelectedSupplier,
  suppliers,
}) {
  const initialValues = {
    id_item: purchaseDetails.items[0].id_item || '',
    quantity: purchaseDetails.items[0].quantity || '',
    unit_price: purchaseDetails.items[0].unit_price || '',
    payment_method: purchaseDetails.details.payment_method || '',
    rut_supplier: selectedSupplier || '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={newPurchaseValidationExisting}
      enableReinitialize
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => {
        const selectedItem = items.find((item) => item.id_item.toString() === values.id_item);

        useEffect(() => {
          if (values.quantity && values.unit_price) {
            const amount = values.quantity * values.unit_price;

            setPurchaseDetails((prev) => ({
              ...prev,
              items: [
                {
                  id_item: values.id_item,
                  quantity: values.quantity,
                  unit_price: values.unit_price,
                  rut_supplier: values.rut_supplier,
                },
              ],
              details: {
                ...prev.details,
                amount,
                description: `Compra de ${values.quantity} unidades de ${
                  selectedItem?.name_item || 'producto'
                }`,
                payment_method: values.payment_method,
              },
            }));
          }
        }, [values, selectedItem]);

        return (
          <Form className="grid grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* Producto */}
              <div>
                <Label htmlFor="id_item">
                  Producto <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.id_item}
                  onValueChange={(value) => setFieldValue('id_item', value)}
                >
                  <SelectTrigger>
                    <span>
                      {items.find((item) => item.id_item.toString() === values.id_item)?.name_item ||
                        'Seleccionar producto'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id_item} value={item.id_item.toString()}>
                        {item.name_item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage name="id_item" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Cantidad */}
              <div>
                <Label htmlFor="quantity">
                  Cantidad <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Cantidad comprada"
                />
                <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Precio Unitario */}
              <div>
                <Label htmlFor="unit_price">
                  Precio Unitario <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="unit_price"
                  name="unit_price"
                  type="number"
                  placeholder="Precio unitario de compra"
                />
                <ErrorMessage name="unit_price" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              {/* Proveedor */}
              <div>
                <Label htmlFor="rut_supplier">
                  Proveedor <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.rut_supplier}
                  onValueChange={(value) => {
                    setFieldValue('rut_supplier', value);
                    setSelectedSupplier(value);
                  }}
                >
                  <SelectTrigger>
                    <span>
                      {suppliers.find((sup) => sup.rut_supplier === values.rut_supplier)
                        ?.name_supplier || 'Seleccionar proveedor'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.rut_supplier} value={supplier.rut_supplier}>
                        {supplier.name_supplier} - {supplier.rut_supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage name="rut_supplier" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Método de Pago */}
              <div>
                <Label htmlFor="payment_method">
                  Método de Pago <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.payment_method}
                  onValueChange={(value) => setFieldValue('payment_method', value)}
                >
                  <SelectTrigger>
                    <span>{capitalize(values.payment_method) || 'Seleccionar método de pago'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="payment_method"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
