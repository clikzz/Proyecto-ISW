import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateSupplier } from '@api/suppliers';
import { useAlert } from '@context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { modifySupplierValidation } from '@/validations/modifySupplier';
import PhoneInput from '@/components/ui/phone-input';

export default function ModifySupplierDialog({
  supplier,
  fetchSuppliers,
  isOpen,
  onClose,
}) {
  const { showAlert } = useAlert();

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      if (!modifySupplierValidation) {
        throw new Error('Validation schema is not defined');
      }
      await modifySupplierValidation.validate(values, { abortEarly: false });
      await updateSupplier(values.rut_supplier, values);
      onClose();
      resetForm();
      fetchSuppliers();
    } catch (error) {
      showAlert(error.response?.data.errors, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Modificar proveedor</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            rut_supplier: supplier.rut_supplier,
            name_supplier: supplier.name_supplier,
            email_supplier: supplier.email_supplier,
            phone_supplier: supplier.phone_supplier,
            address_supplier: supplier.address_supplier,
          }}
          validationSchema={modifySupplierValidation}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="rut_supplier">RUT</Label>
                <Field
                  as={Input}
                  id="rut_supplier"
                  name="rut_supplier"
                  value={values.rut_supplier}
                  readOnly
                  className="cursor-default text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="name_supplier">
                  Nombre <span style={{ color: 'red' }}>*</span>
                </Label>
                <Field
                  as={Input}
                  id="name_supplier"
                  name="name_supplier"
                  value={values.name_supplier}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
                <ErrorMessage
                  name="name_supplier"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <div>
                <Label htmlFor="phone_supplier">
                  Teléfono <span style={{ color: 'red' }}>*</span>
                </Label>
                <PhoneInput
                  id="phone_supplier"
                  name="phone_supplier"
                  value={values.phone_supplier}
                  onChange={(value) => setFieldValue('phone_supplier', value)}
                  required
                />
                <ErrorMessage
                  name="phone_supplier"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <div>
                <Label htmlFor="email_supplier">Email</Label>
                <Field
                  as={Input}
                  id="email_supplier"
                  name="email_supplier"
                  type="email"
                  value={values.email_supplier}
                  readOnly
                />
                <ErrorMessage
                  name="email_supplier"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <div>
                <Label htmlFor="address_supplier">Dirección (opcional)</Label>
                <Field
                  as={Input}
                  id="address_supplier"
                  name="address_supplier"
                  value={values.address_supplier}
                  onChange={handleChange}
                  placeholder="Dirección"
                />
                <ErrorMessage
                  name="address_supplier"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <Button type="submit">Modificar</Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
