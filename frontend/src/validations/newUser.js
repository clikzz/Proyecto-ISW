import * as Yup from 'yup';

export const newUserValidation = Yup.object().shape({
  name_user: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'El nombre solo puede contener letras')
    .trim()
    .lowercase()
    .required('El nombre es requerido'),
  rut: Yup.string()
    .matches(
      /^(\d{1,2}\.?\d{3}\.?\d{3}-?[0-9Kk])$/,
      'El rut debe tener un formato válido'
    )
    .test(
      'len',
      'El rut debe tener 11 o 12 caracteres',
      (val) => val && (val.length === 11 || val.length === 12)
    )

    .required('El rut es requerido'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'El email debe tener un formato válido'
    )
    .email('El email debe ser válido')
    .required('El email es requerido'),
});
