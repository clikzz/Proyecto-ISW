import * as Yup from 'yup';

export const editPurchaseValidation = Yup.object().shape({
  quantity_item: Yup.number()
    .typeError('La cantidad debe ser un número válido')
    .integer('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .optional(),
  unit_price: Yup.number()
    .typeError('El precio unitario debe ser un número válido')
    .min(0, 'El precio unitario debe ser mayor o igual a 0')
    .optional(),
  payment_method: Yup.string()
    .optional(),
  description: Yup.string()
    .max(200, 'La descripción no puede superar los 200 caracteres'),
});