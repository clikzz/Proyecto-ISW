import React, { useState } from 'react';
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
import { UserPlus } from 'lucide-react';
import { addSupplier } from '@api/suppliers';
import { useAlert } from '@context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { newSupplierValidation } from '@/validations/newSupplier';

export default function AddSupplierDialog({ fetchSuppliers }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showAlert } = useAlert();

  const formatRut = (value) => {
    const cleanValue = value
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/\s+/g, '');
    if (cleanValue.length > 11) return value;

    const cuerpo = cleanValue.slice(0, -1);
    const verificador = cleanValue.slice(-1);
    const formattedCuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedCuerpo}-${verificador}`;
  };

  const handleRutChange = (e, setFieldValue) => {
    const value = e.target.value.toUpperCase();
    const numericValue = value.replace(/[^0-9K]/g, '');
    const formattedRut = formatRut(numericValue);
    if (formattedRut.length <= 12) {
      setFieldValue('rut_supplier', formattedRut);
    }
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    console.log(values);

    try {
      if (!newSupplierValidation) {
        throw new Error('Validation schema is not defined');
      }
      await newSupplierValidation.validate(values, { abortEarly: false });
      await addSupplier(values);
      setIsDialogOpen(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showAlert(error.response?.data.message || error.message, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Proveedor
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Formulario de nuevo proveedor</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            rut_supplier: '',
            name_supplier: '',
            email_supplier: '',
            phone_supplier: '',
            address_supplier: '',
          }}
          validationSchema={newSupplierValidation}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="rut_supplier">
                  RUT <span style={{ color: 'red' }}>*</span>
                </Label>
                <Field
                  as={Input}
                  id="rut_supplier"
                  name="rut_supplier"
                  value={values.rut_supplier}
                  onChange={(e) => handleRutChange(e, setFieldValue)}
                  placeholder="12.345.678-9"
                  required
                />
                <ErrorMessage
                  name="rut_supplier"
                  component="div"
                  style={{ color: 'red' }}
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
                <Field
                  as={Input}
                  id="phone_supplier"
                  name="phone_supplier"
                  value={values.phone_supplier}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  required
                />
                <ErrorMessage
                  name="phone_supplier"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <div>
                <Label htmlFor="email_supplier">Email (opcional)</Label>
                <Field
                  as={Input}
                  id="email_supplier"
                  name="email_supplier"
                  type="email"
                  value={values.email_supplier}
                  onChange={handleChange}
                  placeholder="ejemplo@mail.com"
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
              <Button type="submit">Agregar</Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
