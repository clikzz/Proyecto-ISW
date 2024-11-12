const Joi = require('joi');

const inventorySchema = Joi.object({
  type: Joi.string()
    .valid('venta', 'compra')
    .required()
    .messages({
      'any.required': 'El tipo de transacción es obligatorio.',
      'any.only': 'El tipo de transacción debe ser "venta" o "compra".',
    }),
  items: Joi.array().items(
    Joi.object({
      id_item: Joi.number()
        .integer()
        .allow(null)
        .messages({
          'number.base': 'El ID del item debe ser un número.',
        }),
      name_item: Joi.string()
        .max(50)
        .when('id_item', { is: null, then: Joi.required() })
        .messages({
          'string.empty': 'El nombre del item no puede estar vacío.',
          'string.max': 'El nombre del item no puede exceder los 50 caracteres.',
        }),
      description: Joi.string()
        .allow('')
        .optional()
        .when('id_item', { is: null, then: Joi.optional() })
        .messages({
          'string.base': 'La descripción debe ser de tipo texto.',
        }),
      category: Joi.string()
        .max(50)
        .when('id_item', { is: null, then: Joi.required() })
        .messages({
          'string.empty': 'La categoría no puede estar vacía.',
          'string.max': 'La categoría no puede exceder los 50 caracteres.',
        }),
      cantidad: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          'number.base': 'La cantidad debe ser un número entero.',
          'number.positive': 'La cantidad debe ser positiva.',
          'any.required': 'La cantidad es obligatoria.',
        }),
      precio_unitario: Joi.number()
        .positive()
        .required()
        .messages({
          'number.base': 'El precio unitario debe ser un número.',
          'number.positive': 'El precio unitario debe ser positivo.',
          'any.required': 'El precio unitario es obligatorio.',
        }),
      selling_price: Joi.number()
        .positive()
        .when('id_item', { is: null, then: Joi.required() })
        .messages({
          'number.base': 'El precio de venta debe ser un número.',
          'number.positive': 'El precio de venta debe ser positivo.',
          'any.required': 'El precio de venta es obligatorio cuando se crea un nuevo item.',
        }),
    })
  ).required()
    .messages({
      'array.base': 'Los items deben ser un arreglo de objetos.',
      'any.required': 'Los items son obligatorios.',
    }),
  details: Joi.object({
    rut: Joi.string()
      .required()
      .messages({
        'string.base': 'El RUT debe ser una cadena de texto.',
        'any.required': 'El RUT del empleado que registra la transacción es obligatorio.',
      }),
    rut_supplier: Joi.string()
      .when('type', { is: 'compra', then: Joi.required() })
      .messages({
        'any.required': 'Para la compra de un nuevo item, es necesario proporcionar el rut del proveedor.',
      }),
    monto: Joi.number()
      .positive()
      .required()
      .messages({
        'number.base': 'El monto debe ser un número.',
        'number.positive': 'El monto debe ser positivo.',
        'any.required': 'El monto es obligatorio.',
      }),
    metodo_pago: Joi.string()
      .required()
      .messages({
        'string.base': 'El método de pago debe ser texto.',
        'any.required': 'El método de pago es obligatorio.',
      }),
    descripcion: Joi.string()
      .allow('')
      .messages({
        'string.base': 'La descripción debe ser texto.',
      }),
  }).required()
    .messages({
      'object.base': 'Los detalles deben ser un objeto.',
      'any.required': 'Los detalles son obligatorios.',
    }),
});

module.exports = { inventorySchema };