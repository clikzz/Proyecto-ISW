import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { capitalize } from '@/helpers/capitalize';
import { newPurchaseValidationNew } from '@/validations/newPurchase';

export default function NewPurchaseForm({
  newItem,
  setNewItem,
  suppliers,
  purchaseDetails,
  setPurchaseDetails,
}) {
  const initialValues = {
    name_item: newItem.name_item || '',
    category: newItem.category || '',
    description: newItem.description || '',
    quantity: newItem.quantity || '',
    unit_price: newItem.unit_price || '',
    selling_price: newItem.selling_price || '',
    rut_supplier: newItem.rut_supplier || '',
    payment_method: purchaseDetails.details.payment_method || '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={newPurchaseValidationNew}
      enableReinitialize
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          if (values.quantity && values.unit_price) {
            const amount = values.quantity * values.unit_price;

            setNewItem({
              ...values,
              quantity: parseInt(values.quantity, 10),
              unit_price: parseFloat(values.unit_price),
              selling_price: parseFloat(values.selling_price),
            });

            setPurchaseDetails((prev) => ({
              ...prev,
              details: {
                ...prev.details,
                amount,
                description: `Compra de ${values.quantity} unidades de ${values.name_item || 'producto nuevo'}`,
                payment_method: values.payment_method,
              },
            }));
          }
        }, [values, setNewItem, setPurchaseDetails]);

        return (
          <Form className="grid grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <Label htmlFor="name_item">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="name_item"
                  name="name_item"
                  placeholder="Nombre del producto"
                />
                <ErrorMessage name="name_item" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Categoría */}
              <div>
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => setFieldValue('category', value)}
                >
                  <SelectTrigger>{capitalize(values.category) || 'Seleccionar categoría'}</SelectTrigger>
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

              {/* Precio de Venta */}
              <div>
                <Label htmlFor="selling_price">
                  Precio de Venta <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  placeholder="Establecer precio de venta"
                />
                <ErrorMessage name="selling_price" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">
                  Descripción
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Descripción del producto"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
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
                  onValueChange={(value) => setFieldValue('rut_supplier', value)}
                >
                  <SelectTrigger>{values.rut_supplier || 'Seleccionar proveedor'}</SelectTrigger>
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
                  <SelectTrigger>{capitalize(values.payment_method) || 'Seleccionar método de pago'}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage name="payment_method" component="div" className="text-red-500 text-sm" />
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
          </Form>
        );
      }}
    </Formik>
  );
}
