import * as Yup from 'yup';

export const newTransactionValidation = Yup.object().shape({
  transaction_type: Yup.string()
    .oneOf(['ingreso', 'egreso'], 'Tipo de transacción inválido')
    .required('El tipo de transacción es requerido'),
  amount: Yup.number()
    .positive('El monto debe ser un número positivo mayor que 0')
    .integer('El monto debe ser un número entero')
    .required('El monto es requerido'),
  payment_method: Yup.string()
    .oneOf(['efectivo', 'transferencia', 'tarjeta'], 'Método de pago inválido')
    .required('El método de pago es requerido'),
  description: Yup.string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .required('La descripción es requerida'),
});
