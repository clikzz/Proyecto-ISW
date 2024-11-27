const Joi = require('joi');

const createServiceSchema = Joi.object({
  name_service: Joi.string().max(255).required().messages({
    'string.empty': 'El nombre del servicio es obligatorio.',
    'string.max': 'El nombre del servicio no puede exceder 255 caracteres.',
  }),
  description_service: Joi.string().max(500).optional().allow(''),
  price_service: Joi.number().positive().required().messages({
    'number.base': 'El precio del servicio debe ser un número.',
    'number.positive': 'El precio debe ser positivo.',
  }),
  date_service: Joi.date().iso().required().messages({
    'date.base': 'La fecha del servicio debe ser válida.',
    'date.iso': 'La fecha del servicio debe estar en formato ISO.',
  }),
  user_rut: Joi.string().max(12).required().messages({
    'string.empty': 'El RUT del usuario es obligatorio.',
    'string.max': 'El RUT del usuario no puede exceder 12 caracteres.',
  }),
});

const updateServiceSchema = Joi.object({
  name_service: Joi.string().max(255).optional(),
  description_service: Joi.string().max(500).optional(),
  price_service: Joi.number().positive().optional(),
  date_service: Joi.date().iso().optional(),
  user_rut: Joi.string().max(12).optional(),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};
