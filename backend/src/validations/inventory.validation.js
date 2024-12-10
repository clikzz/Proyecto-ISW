const Joi = require('joi');

const purchaseSchema = Joi.object({
  type: Joi.string()
  .valid('compra')
  .required()
  .messages({
    'any.required': 'El tipo de transacción es obligatorio.',
    'any.only': 'El tipo de transacción debe ser "compra".',
  }),
  items: Joi.array()
    .items(
      Joi.object({
        id_item: Joi.number()
          .integer()
          .messages({
            'number.base': 'El ID del ítem debe ser un número.',
          }),
        name_item: Joi.string()
          .when('id_item', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required().messages({
              'any.required': 'El nombre del ítem es obligatorio para nuevos productos.',
            }),
          }),
        category: Joi.string()
          .when('id_item', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required().messages({
              'any.required': 'La categoría es obligatoria para nuevos productos.',
            }),
          }),
        description: Joi.string()
          .allow('')
          .messages({
            'string.base': 'La descripción debe ser texto.',
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
        selling_price: Joi.number()
          .positive()
          .when('id_item', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required().messages({
              'any.required': 'El precio de venta es obligatorio para nuevos productos.',
            }),
          }),
        rut_supplier: Joi.string()
          .required()
          .messages({
            'any.required': 'El RUT del proveedor es obligatorio para compras.',
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Los ítems deben ser un arreglo de objetos.',
      'array.min': 'Debe incluir al menos un ítem en la transacción.',
      'any.required': 'Los ítems son obligatorios.',
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

const saleSchema = Joi.object({
  type: Joi.string()
  .valid('venta')
  .required()
  .messages({
    'any.required': 'El tipo de transacción es obligatorio.',
    'any.only': 'El tipo de transacción debe ser "venta".',
  }),
  items: Joi.array()
    .items(
      Joi.object({
        id_item: Joi.number().integer().required().messages({
          'number.base': 'El ID del ítem debe ser un número.',
          'any.required': 'El ID del ítem es obligatorio.',
        }),
        quantity: Joi.number().integer().positive().required().messages({
          'number.base': 'La cantidad debe ser un número entero.',
          'number.positive': 'La cantidad debe ser mayor a 0.',
          'any.required': 'La cantidad es obligatoria.',
        }),
        unit_price: Joi.number().positive().required().messages({
          'number.base': 'El precio unitario debe ser un número.',
          'number.positive': 'El precio unitario debe ser mayor a 0.',
          'any.required': 'El precio unitario es obligatorio.',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Los ítems deben ser un arreglo de objetos.',
      'array.min': 'Debe incluir al menos un ítem en la transacción.',
      'any.required': 'Los ítems son obligatorios.',
    }),
  details: Joi.object({
    amount: Joi.number().positive().required().messages({
      'number.base': 'El monto debe ser un número.',
      'number.positive': 'El monto debe ser mayor a 0.',
      'any.required': 'El monto total es obligatorio.',
    }),
    payment_method: Joi.string().required().messages({
      'string.base': 'El método de pago debe ser texto.',
      'any.required': 'El método de pago es obligatorio.',
    }),
    description: Joi.string().allow('').messages({
      'string.base': 'La descripción debe ser texto.',
    }),
  }).required().messages({
    'object.base': 'Los detalles deben ser un objeto.',
    'any.required': 'Los detalles de la transacción son obligatorios.',
  }),
});

module.exports = { purchaseSchema, saleSchema };