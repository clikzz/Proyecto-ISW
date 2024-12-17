import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';
import { addItem } from '@api/inventory';
import { getSuppliers } from '@/api/suppliers';
import { useAlert } from '@context/alertContext';
import { capitalize } from '@/helpers/capitalize';
import { Textarea } from '@/components/ui/textarea';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { newItemValidation } from '@/validations/newItem';

export default function AddItemDialog({ fetchItems }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [newItem, setNewItem] = useState({
    name_item: '',
    description: '',
    category: '',
    selling_price: '',
    stock: '',
  });
  const { showAlert } = useAlert();

  const handleInputChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
    setFieldValue(name, value);
  };

  const handleFormikSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addItem(values);
      showAlert('Item añadido', 'success');
      setIsDialogOpen(false);

      setNewItem({
        name_item: '',
        description: '',
        category: '',
        selling_price: '',
        stock: '',
      });

      resetForm();
      fetchItems();
    } catch (error) {
      showAlert('Error al añadir el item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };
  
  useEffect(() => {
    if (isDialogOpen) {
      fetchSuppliers();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="items-center gap-2 bg-blue-500 text-white">
          <PackagePlus size="16" />
          Añadir Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-card text-card-foreground max-w-3xl mx-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Formulario de Nuevo Producto</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={newItem}
          validationSchema={newItemValidation}
          onSubmit={handleFormikSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="name_item">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="name_item"
                  name="name_item"
                  placeholder="Nombre del producto"
                  required
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage name="name_item" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => {
                    setNewItem((prev) => ({ ...prev, category: value }));
                    setFieldValue('category', value);
                  }}
                >
                  <SelectTrigger>
                    {capitalize(values.category) || 'Seleccionar categoría'}
                  </SelectTrigger>
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
              <div>
                <Label htmlFor="selling_price">
                  Precio Venta <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  placeholder="Establecer precio de venta"
                  required
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage name="selling_price" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="stock">
                  Stock <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Stock disponible"
                  required
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage name="stock" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Descripción del producto"
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
