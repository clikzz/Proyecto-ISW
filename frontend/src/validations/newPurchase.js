import * as Yup from 'yup';

export const newPurchaseValidationExisting = Yup.object().shape({
  id_item: Yup.number().required('Debes seleccionar un producto.'),
  quantity: Yup.number()
    .positive('La cantidad debe ser mayor a 0.')
    .required('La cantidad es requerida.'),
  unit_price: Yup.number()
    .positive('El precio debe ser mayor a 0.')
    .required('El precio unitario es requerido.'),
  payment_method: Yup.string().required('El método de pago es requerido.'),
  rut_supplier: Yup.string().required('El proveedor es requerido.'),
});

export const newPurchaseValidationNew = Yup.object().shape({
  name_item: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .required('El nombre del producto es requerido.'),
  category: Yup.string().required('Debes seleccionar una categoría.'),
  quantity: Yup.number()
    .positive('La cantidad debe ser mayor a 0.')
    .required('La cantidad es requerida.'),
  unit_price: Yup.number()
    .positive('El precio debe ser mayor a 0.')
    .required('El precio unitario es requerido.'),
  selling_price: Yup.number()
    .positive('El precio de venta debe ser mayor a 0.')
    .required('El precio de venta es requerido.'),
  rut_supplier: Yup.string().required('El proveedor es requerido.'),
  payment_method: Yup.string().required('El método de pago es requerido.'),
});
