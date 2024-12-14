import * as Yup from 'yup';

export const newServiceValidation = Yup.object().shape({
  name_service: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre debe tener como máximo 255 caracteres')
    .required('El nombre es obligatorio'),

  description_service: Yup.string()
    .nullable()
    .notRequired()
    .max(500, 'La descripción no debe exceder los 500 caracteres')
    .transform((value) => (value === '' ? null : value)),

  price_service: Yup.number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser un número positivo'),

  category: Yup.string()
    .oneOf(
      ['reparación', 'mantenimiento', 'personalización', 'otro'],
      'Selecciona una categoría válida'
    )
    .required('La categoría es obligatoria'),

  payment_method_service: Yup.string()
    .oneOf(
      ['efectivo', 'tarjeta', 'transferencia'],
      'Selecciona un método de pago válido'
    )
    .required('El método de pago es obligatorio'),
});
