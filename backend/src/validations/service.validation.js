const Joi = require('joi');

const createServiceSchema = Joi.object({
  name_service: Joi.string()
    .max(255).required(),
  category: Joi.string()
    .valid('reparación', 'mantenimiento', 'personalización', 'otro')
    .required(),
  payment_method_service: Joi.string()
    .valid('efectivo', 'tarjeta', 'transferencia')
    .required(),
  description_service: Joi.string()
    .max(500)
    .optional()
    .allow(''),
  price_service: Joi.number()
    .positive()
    .required()
    .integer()
    .messages({
      'number.base': 'El precio del servicio debe ser un número.',
      'number.positive': 'El precio debe ser positivo.',
      'number.integer': 'El precio no puede tener decimales.',
    }),
});


const updateServiceSchema = Joi.object({
  name_service: Joi.string()
    .max(255)
    .optional(),
  description_service: Joi.string()
    .max(500)
    .optional()
    .allow(''),
  price_service: Joi.number()
    .positive()
    .optional()
    .integer()
    .messages({
    'number.base': 'El precio del servicio debe ser un número.',
    'number.positive': 'El precio debe ser positivo.',
    'number.integer': 'El precio no puede tener decimales.',
  }),
  category: Joi.string()
    .valid('reparación', 'mantenimiento', 'personalización', 'otro')
    .optional(),
  payment_method_service: Joi.string()
    .valid('efectivo', 'tarjeta', 'transferencia')
    .optional(),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};
