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
import { addUser } from '@api/user';
import { useAlert } from '@context/alertContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { newUserValidation } from '@/validations/newUser';

export default function AddUserDialog({ fetchUsers }) {
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
      setFieldValue('rut', formattedRut);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!newUserValidation) {
        throw new Error('Validation schema is not defined');
      }
      await newUserValidation.validate(values, { abortEarly: false });
      await addUser(values);
      setIsDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.log(error);
      showAlert(
        error.response?.data.errors ||
          error.response?.data.message ||
          error.message,
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center rounded-xl">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Formulario de nuevo usuario</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{ name_user: '', rut: '', email: '' }}
          validationSchema={newUserValidation}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="name_user">Nombre</Label>
                <Field
                  as={Input}
                  id="name_user"
                  name="name_user"
                  value={values.name_user}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
                <ErrorMessage
                  name="name_user"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <div>
                <Label htmlFor="rut">RUT</Label>
                <Field
                  as={Input}
                  id="rut"
                  name="rut"
                  value={values.rut}
                  onChange={(e) => handleRutChange(e, setFieldValue)}
                  placeholder="12.345.678-9"
                  required
                />
                <ErrorMessage
                  name="rut"
                  component="div"
                  style={{ color: 'red' }}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="ejemplo@mail.com"
                  required
                />
                <ErrorMessage
                  name="email"
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
