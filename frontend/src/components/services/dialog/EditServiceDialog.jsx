import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { updateService } from '@/api/service';
import { useAlert } from '@/context/alertContext';

const EditServiceDialog = ({ isOpen, onClose, service, onUpdateService }) => {
  const [editedService, setEditedService] = useState({});
  const { showAlert } = useAlert();

  useEffect(() => {
    if (service) {
      setEditedService({ ...service });
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedFields = Object.keys(editedService).reduce((changes, key) => {
        if (editedService[key] !== service[key]) {
          changes[key] = editedService[key];
        }
        return changes;
      }, {});

      if (Object.keys(updatedFields).length === 0) {
        showAlert('No hay cambios para guardar.', 'info');
        return;
      }

      const response = await updateService(service.id_service, updatedFields);
      onUpdateService(response);
      showAlert('Servicio actualizado correctamente.', 'success');
      onClose();
    } catch (error) {
      showAlert('Error al actualizar el servicio.', 'error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
        </DialogHeader>
        <div>
          <label>Nombre</label>
          <input
            name="name_service"
            value={editedService.name_service || ''}
            onChange={handleInputChange}
            className="p-2 border rounded-md w-full mb-4"
          />
          
          <label>Categoría</label>
          <Select
            value={editedService.category || ''}
            onValueChange={(value) => setEditedService((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {['Reparación', 'Mantenimiento', 'Personalización', 'Otro'].map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label>Método de Pago</label>
          <Select
            value={editedService.payment_method_service || ''}
            onValueChange={(value) =>
              setEditedService((prev) => ({ ...prev, payment_method_service: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método de pago" />
            </SelectTrigger>
            <SelectContent>
              {['Efectivo', 'Tarjeta', 'Transferencia'].map((method) => (
                <SelectItem key={method} value={method.toLowerCase()}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label>Precio</label>
          <input
            name="price_service"
            type="number"
            value={editedService.price_service || ''}
            onChange={handleInputChange}
            className="p-2 border rounded-md w-full mb-4"
          />
          
          <label>Descripción</label>
          <Textarea
            name="description_service"
            value={editedService.description_service || ''}
            onChange={handleInputChange}
            className="p-2 border rounded-md w-full mb-4"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
