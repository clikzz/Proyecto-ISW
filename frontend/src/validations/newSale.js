import * as Yup from 'yup';

export const sellItemValidation = Yup.object().shape({
  selectedItem: Yup.string().required('Debes seleccionar un producto'),
  quantity: Yup.number()
    .typeError('La cantidad debe ser un número válido')
    .min(1, 'La cantidad debe ser al menos 1')
    .required('La cantidad es requerida'),
  paymentMethod: Yup.string().required('El método de pago es requerido'),
});