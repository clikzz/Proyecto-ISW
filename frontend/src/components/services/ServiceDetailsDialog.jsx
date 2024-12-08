import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { updateService } from '@/api/service';
import { capitalize } from '@/helpers/capitalize';

const ServiceDetailsDialog = ({ isOpen, onClose, service, onUpdateService }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);

  useEffect(() => {
    if (service) {
      setEditedService({ ...service });
      setIsEditing(false);
    }
  }, [service]);

  if (!service) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedService = {
        ...editedService,
        category: editedService.category.toLowerCase(),
        payment_method_service: editedService.payment_method_service || 'Sin definir',
      };

      const response = await updateService(service.id_service, updatedService);

      if (response) {
        onUpdateService(response);
      }

      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error al actualizar el servicio:', error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    setEditedService(service);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Detalles del Servicio</DialogTitle>
        </DialogHeader>
        <div>
          {/* Columna izquierda */}
          <div>
            <FormField
              label="Nombre"
              isEditing={isEditing}
              name="name_service"
              value={editedService.name_service}
              onChange={handleInputChange}
              displayValue={capitalize(service.name_service)}
            />
            <FormSelect
              label="Categoría"
              isEditing={isEditing}
              value={editedService.category}
              options={['Reparación', 'Mantenimiento', 'Personalización', 'Otro']}
              onSelect={(value) => setEditedService((prev) => ({ ...prev, category: value }))}
              displayValue={capitalize(service.category)}
            />
            <FormField
              label="Precio"
              isEditing={isEditing}
              name="price_service"
              value={editedService.price_service}
              type="number"
              onChange={handleInputChange}
              displayValue={`$${service.price_service}`}
            />
          </div>
          {/* Columna derecha */}
          <div>
            <FormSelect
              label="Método de Pago"
              isEditing={isEditing}
              value={editedService.payment_method_service}
              options={['Efectivo', 'Tarjeta', 'Transferencia']}
              onSelect={(value) =>
                setEditedService((prev) => ({ ...prev, payment_method_service: value }))
              }
              displayValue={capitalize(service.payment_method_service || 'Sin definir')}
            />
            <FormField
              label="Descripción"
              isEditing={isEditing}
              name="description_service"
              value={editedService.description_service}
              type="textarea"
              onChange={handleInputChange}
              displayValue={service.description_service || 'Sin descripción'}
            />
          </div>
        </div>
        <div>
          {isEditing ? (
            <>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FormField = ({ label, isEditing, name, value, onChange, type = 'text', displayValue }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    {isEditing ? (
      type === 'textarea' ? (
        <Textarea name={name} value={value} onChange={onChange} className="p-2 border rounded-md w-full" />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="p-2 border rounded-md w-full"
        />
      )
    ) : (
      <p className="p-2 bg-gray-100 rounded-md">{displayValue}</p>
    )}
  </div>
);

const FormSelect = ({ label, isEditing, value, options, onSelect, displayValue }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    {isEditing ? (
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar opción">{displayValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toLowerCase()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <p className="p-2 bg-gray-100 rounded-md">{displayValue}</p>
    )}
  </div>
);

export default ServiceDetailsDialog;
