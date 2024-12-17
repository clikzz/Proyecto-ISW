// validations/transaction.validation.js
const Joi = require('joi');

const createTransactionSchema = Joi.object({
  transaction_type: Joi.string().valid('ingreso', 'egreso', ).required().messages({
    'any.required': 'El tipo de transacción es obligatorio',
    'any.only': 'El tipo de transacción debe ser ingreso o egreso'
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'El monto debe ser un número',
    'number.positive': 'El monto debe ser un número positivo',
    'any.required': 'El monto es obligatorio'
  }),
  payment_method: Joi.string().valid('efectivo', 'transferencia', 'tarjeta').required().messages({
    'any.required': 'El método de pago es obligatorio',
    'any.only': 'El método de pago debe ser efectivo o transferencia'
  }),
  description: Joi.string().min(3).max(100).required().messages({
    'string.min': 'La descripción debe tener al menos 3 caracteres',
    'string.max': 'La descripción no puede tener más de 100 caracteres',
    'any.required': 'La descripción es obligatoria'
  }),
  rut: Joi.string()
});

module.exports = createTransactionSchema;
