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
        .required()
        .messages({
          'number.base': 'El ID del item debe ser un número.',
          'any.required': 'El ID del item es obligatorio.',
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
