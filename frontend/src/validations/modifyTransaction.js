import * as Yup from 'yup';

export const modifyTransactionValidation = Yup.object().shape({
  transaction_type: Yup.string()
    .oneOf(['ingreso', 'egreso'], 'Tipo de transacción inválido')
    .optional(),
  amount: Yup.number()
    .positive('El monto debe ser un número positivo mayor que 0')
    .integer('El monto debe ser un número entero')
    .optional(),
  payment_method: Yup.string()
    .oneOf(['efectivo', 'transferencia', 'tarjeta'], 'Método de pago inválido')
    .optional(),
  description: Yup.string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .optional(),
});
