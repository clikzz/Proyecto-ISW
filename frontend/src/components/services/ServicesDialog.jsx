import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import { createService } from '@/api/service';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function AddServiceDialog({ onAddService }) {
  const [formData, setFormData] = useState({
    name_service: '',
    description_service: '',
    price_service: '',
    category: '',
    payment_method_service: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = await createService(formData);
      setFormData({
        name_service: '',
        description_service: '',
        price_service: '',
        category: '',
        payment_method_service: '',
      });
      onAddService(newService);
      setIsOpen(false);
    } catch (error) {
      console.error('Error al agregar servicio:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Wrench className="mr-2 h-4 w-4" />
          Añadir Servicio
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none text-foreground">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name_service">Nombre</Label>
            <Input
              id="name_service"
              value={formData.name_service}
              onChange={(e) => setFormData({ ...formData, name_service: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description_service">Descripción</Label>
            <Input
              id="description_service"
              value={formData.description_service}
              onChange={(e) => setFormData({ ...formData, description_service: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value.toLowerCase() })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reparación">Reparación</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="personalización">Personalización</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price_service">Precio</Label>
            <Input
              id="price_service"
              type="number"
              value={formData.price_service}
              onChange={(e) => setFormData({ ...formData, price_service: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="payment_method_service">Método de Pago</Label>
            <Select
              value={formData.payment_method_service}
              onValueChange={(value) => setFormData({ ...formData, payment_method_service: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón Guardar */}
          <Button type="submit">Guardar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
