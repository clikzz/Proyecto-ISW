import * as Yup from 'yup';

export const newItemValidation = Yup.object().shape({
  name_item: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres')
    .required('El nombre es requerido'),
  category: Yup.string()
    .required('La categoría es requerida'),
  selling_price: Yup.number()
    .typeError('El precio debe ser un número')
    .min(0, 'El precio debe ser mayor o igual a 0')
    .required('El precio de venta es requerido'),
  stock: Yup.number()
    .typeError('El stock debe ser un número')
    .min(0, 'El stock debe ser mayor o igual a 0')
    .required('El stock es requerido'),
  description: Yup.string()
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .nullable(),
});