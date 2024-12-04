const Joi = require('joi');

const inventorySchema = Joi.object({
  type: Joi.string()
    .valid('venta', 'compra')
    .required()
    .messages({
      'any.required': 'El tipo de transacción es obligatorio.',
      'any.only': 'El tipo de transacción debe ser "venta" o "compra".',
    }),
  items: Joi.array()
    .items(
      Joi.object({
        id_item: Joi.number()
          .integer()
          .required()
          .messages({
            'number.base': 'El ID del ítem debe ser un número.',
            'any.required': 'El ID del ítem es obligatorio.',
          }),
        quantity: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            'number.base': 'La cantidad debe ser un número entero.',
            'number.positive': 'La cantidad debe ser mayor a 0.',
            'any.required': 'La cantidad es obligatoria.',
          }),
        unit_price: Joi.number()
          .positive()
          .required()
          .messages({
            'number.base': 'El precio unitario debe ser un número.',
            'number.positive': 'El precio unitario debe ser mayor a 0.',
            'any.required': 'El precio unitario es obligatorio.',
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Los items deben ser un arreglo de objetos.',
      'array.min': 'Debe incluir al menos un ítem en la transacción.',
      'any.required': 'Los items son obligatorios.',
    }),
  details: Joi.object({
    amount: Joi.number()
      .positive()
      .required()
      .messages({
        'number.base': 'El monto debe ser un número.',
        'number.positive': 'El monto debe ser mayor a 0.',
        'any.required': 'El monto total es obligatorio.',
      }),
    payment_method: Joi.string()
      .required()
      .messages({
        'string.base': 'El método de pago debe ser texto.',
        'any.required': 'El método de pago es obligatorio.',
      }),
    description: Joi.string()
      .allow('')
      .messages({
        'string.base': 'La descripción debe ser texto.',
      }),
  })
    .required()
    .messages({
      'object.base': 'Los detalles deben ser un objeto.',
      'any.required': 'Los detalles de la transacción son obligatorios.',
    }),
});

module.exports = { inventorySchema };
