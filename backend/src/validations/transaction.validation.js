// validations/transaction.validation.js
const Joi = require('joi');

const createTransactionSchema = Joi.object({
  tipo: Joi.string().valid('ingreso', 'egreso').required().messages({
    'any.required': 'El tipo de transacción es obligatorio',
    'any.only': 'El tipo de transacción debe ser ingreso o egreso'
  }),
  monto: Joi.number().positive().required().messages({
    'number.base': 'El monto debe ser un número',
    'number.positive': 'El monto debe ser un número positivo',
    'any.required': 'El monto es obligatorio'
  }),
  metodo_pago: Joi.string().valid('efectivo', 'transferencia').required().messages({
    'any.required': 'El método de pago es obligatorio',
    'any.only': 'El método de pago debe ser efectivo o transferencia'
  }),
  descripcion: Joi.string().min(3).max(100).required().messages({
    'string.min': 'La descripción debe tener al menos 3 caracteres',
    'string.max': 'La descripción no puede tener más de 100 caracteres',
    'any.required': 'La descripción es obligatoria'
  }),
  rut: Joi.string() // No lo marcamos como requerido aquí
});

module.exports = createTransactionSchema;
