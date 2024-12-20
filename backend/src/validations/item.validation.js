const Joi = require('joi');

const allowedCategories = [
  'accesorios',
  'bicicletas',
  'componentes',
  'equipamiento',
  'electrónica',
  'herramientas',
  'limpieza',
  'repuestos',
  'otros',
]

const createItem = Joi.object({
  name_item: Joi.string()
  .max(50)
  .required()
  .messages({
    'string.empty': 'El nombre del item no puede estar vacío.',
    'string.max': 'El nombre del item no puede exceder los 50 caracteres.',
  }),
  description: Joi.string()
  .allow('')
  .messages({
    'string.base': 'La descripción debe ser de tipo texto.',
  }),
  category: Joi.string()
  .valid(...allowedCategories)
  .required()
  .messages({
    'any.only': 'La categoría no es válida. Debe ser una de las siguientes: ' + allowedCategories.join(', ') + '.',
    'any.required': 'La categoría es obligatoria.',
  }),
  stock: Joi.number().integer()
  .min(0)
  .required()
  .messages({
    'number.base': 'El stock debe ser un número entero.',
    'number.min': 'El stock no puede ser negativo.',
  }),
  selling_price: Joi.number()
  .positive()
  .required()
  .messages({
    'number.base': 'El precio de venta debe ser un número.',
    'number.positive': 'El precio de venta debe ser positivo.',
  }),
});

const updateItem = Joi.object({
  rut_supplier: Joi.string()
    .max(12)
    .optional()
    .messages({
      'string.max': 'El RUT del proveedor no puede exceder los 12 caracteres.',
    }),
  name_item: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El nombre del item no puede exceder los 50 caracteres.',
    }),
  description: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'La descripción debe ser de tipo texto.',
    }),
  category: Joi.string()
    .valid(...allowedCategories)
    .optional()
    .messages({
      'any.only': 'La categoría no es válida. Debe ser una de las siguientes: ' + allowedCategories.join(', ') + '.',
    }),
  stock: Joi.number().integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'El stock debe ser un número entero.',
      'number.min': 'El stock no puede ser negativo.',
    }),
  selling_price: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': 'El precio de venta debe ser un número.',
      'number.positive': 'El precio de venta debe ser positivo.',
    }),
});

module.exports = {
  createItem,
  updateItem,
};
