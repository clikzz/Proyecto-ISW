const Joi = require('joi');

const loginSchema = Joi.object({
  rut: Joi.string()
    .pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/)
    .trim()
    .required()
    .max(12)
    .messages({
      'string.empty': 'El RUT no puede estar vacío.',
      'string.pattern.base': 'El RUT debe tener el formato 12.345.678-9 o 12.345.678-K.',
      'string.max': 'El RUT no puede exceder los 12 caracteres.',
      'any.required': 'El RUT es obligatorio.',
    }),
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'La contraseña no puede estar vacía.',
      'any.required': 'La contraseña es obligatoria.',
    }),
});

module.exports = loginSchema;
