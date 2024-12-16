import * as Yup from 'yup';

export const editSaleValidation = Yup.object().shape({
  payment_method: Yup.string()
    .optional(),
  quantity_item: Yup.number()
    .typeError('La cantidad debe ser un número válido')
    .min(1, 'La cantidad debe ser al menos 1')
    .optional(),
  description: Yup.string()
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .nullable(),
});