import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addSupplier } from '@api/suppliers';

const AddSupplierDialog = ({ onClose }) => {
  const [formData, setFormData] = useState({
    rut_supplier: '',
    name_supplier: '',
    email_supplier: '',
    phone_supplier: '',
    address_supplier: '',
  });
  const [errorMessages, setErrorMessages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSupplier(formData);
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        console.error('Error al añadir proveedor:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-background text-foreground p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Añadir Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              name="rut_supplier"
              placeholder="RUT"
              value={formData.rut_supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="name_supplier"
              placeholder="Nombre"
              value={formData.name_supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="email_supplier"
              placeholder="Correo"
              value={formData.email_supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="phone_supplier"
              placeholder="Teléfono"
              value={formData.phone_supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="address_supplier"
              placeholder="Dirección"
              value={formData.address_supplier}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessages.length > 0 && (
            <div className="mb-4 text-red-500">
              <ul>
                {errorMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierDialog;
