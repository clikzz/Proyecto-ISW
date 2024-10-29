const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'El correo electrónico no puede estar vacío.',
      'any.required': 'El correo electrónico es obligatorio.',
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
