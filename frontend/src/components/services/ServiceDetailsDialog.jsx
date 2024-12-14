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
import { useAlert } from '@/context/alertContext';

const ServiceDetailsDialog = ({ isOpen, onClose, service, onUpdateService }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState({
    name_service: '',
    description_service: '',
    price_service: '',
    category: '',
    payment_method_service: '',
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    if (service) {
      setEditedService({ ...service });
    }
  }, [service]);


  // en caso de que no estén disponibles los datos del servicio
  if (!service) {
    return null;
  }

  const formatDateTime = (date) => {
    if (!date) return 'Fecha no disponible';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleString('es-ES', options);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price_service' && !/^\d+$/.test(value)) return; // solo enteros
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSave = async () => {
    try {
      // compara los datos originales y editados para asi identifique los campos modificados
      const updatedFields = Object.keys(editedService).reduce((changes, key) => {
        if (editedService[key] !== service[key]) {
          changes[key] = editedService[key];
        }
        return changes;
      }, {});

      // si no hay cambios, no realiza la solicitud
      if (Object.keys(updatedFields).length === 0) {
        showAlert('No hay cambios para guardar.', 'info');
        setIsEditing(false);
        onClose();
        return;
      }

      // envia solo los campos modificados al backend
      const response = await updateService(service.id_service, updatedFields);

      if (response) {
        showAlert('Servicio actualizado correctamente.', 'success');
        onUpdateService(response);
        setIsEditing(false);
        onClose();
      }
    } catch (error) {
      showAlert('Ocurrió un error al guardar los cambios. Verifica los datos e inténtalo nuevamente.', 'error');
    }
  };



  const handleCancel = () => {
    setEditedService(service);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">
          Detalles del Servicio
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <FormField
              label="Nombre"
              isEditing={isEditing}
              name="name_service"
              value={editedService?.name_service || ''}
              onChange={handleInputChange}
              displayValue={capitalize(editedService?.name_service || 'Sin nombre')}
            />
            <FormSelect
              label="Categoría"
              isEditing={isEditing}
              value={editedService?.category || ''}
              options={['Reparación', 'Mantenimiento', 'Personalización', 'Otro']}
              onSelect={(value) => setEditedService((prev) => ({ ...prev, category: value }))}
              displayValue={capitalize(editedService?.category || 'Sin categoría')}
            />
            <FormField
              label="Precio"
              isEditing={isEditing}
              name="price_service"
              value={editedService?.price_service || ''}
              type="number"
              onChange={handleInputChange}
              displayValue={`$${editedService?.price_service || 0}`}
            />
          </div>
          <div>
            <FormSelect
              label="Método de Pago"
              isEditing={isEditing}
              value={editedService?.payment_method_service || ''}
              options={['Efectivo', 'Tarjeta', 'Transferencia']}
              onSelect={(value) =>
                setEditedService((prev) => ({ ...prev, payment_method_service: value }))
              }
              displayValue={capitalize(editedService?.payment_method_service || 'Sin definir')}
            />
            <FormField
              label="Descripción"
              isEditing={isEditing}
              name="description_service"
              value={editedService?.description_service || ''}
              type="textarea"
              onChange={handleInputChange}
              displayValue={editedService?.description_service || 'Sin descripción'}
            />
          </div>
        </div>

        {/* Fechas de creación y última modificación */}
        <div className="mt-6 flex justify-between items-center text-sm space-x-4">
          <p>
            Registrado el{' '}
            <span className="font-semibold">{formatDateTime(service.created_at)}</span>
          </p>
          <p>
            Modificado por última vez el{' '}
            <span className="font-semibold">{formatDateTime(service.updated_at)}</span>
          </p>
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
