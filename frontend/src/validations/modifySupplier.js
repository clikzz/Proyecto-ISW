import * as Yup from 'yup';

export const modifySupplierValidation = Yup.object().shape({
  name_supplier: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'El nombre solo puede contener letras')
    .trim()
    .lowercase()
    .required('El nombre es requerido'),
  email_supplier: Yup.string()
    .nullable()
    .notRequired()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'El email debe tener un formato válido'
    )
    .email('El email debe ser válido')
    .transform((value) => (value === '' ? null : value)),
  phone_supplier: Yup.string()
    .matches(
      /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/,
      'El teléfono debe tener un formato válido'
    )
    .required('El teléfono es requerido'),
  address_supplier: Yup.string()
    .nullable()
    .notRequired()
    .min(5, 'La dirección debe tener al menos 10 caracteres')
    .max(100, 'La dirección debe tener como máximo 100 caracteres')
    .trim()
    .transform((value) => (value === '' ? null : value)),
});
