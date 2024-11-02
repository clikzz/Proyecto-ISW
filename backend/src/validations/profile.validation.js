const Joi = require('joi');

const validateProfileUpdate = Joi.object({
  name_user: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede tener más de 30 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),
  phone_user: Joi.string()
    .optional()
    .messages({
      'string.base': 'Teléfono inválido',
    }),
  rut: Joi.forbidden().messages({
    'any.unknown': 'El rut no se puede modificar',
  }),
});

const validatePasswordChange = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      'string.min': 'La contraseña actual debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña actual debe contener al menos una letra y un número',
      'any.required': 'La contraseña actual es obligatoria',
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La nueva contraseña debe contener al menos una letra y un número',
      'any.required': 'La nueva contraseña es obligatoria',
    }),
});

module.exports = {
  validateProfileUpdate,
  validatePasswordChange,
};