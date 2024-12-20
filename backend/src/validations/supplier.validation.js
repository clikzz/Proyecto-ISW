const Joi = require('joi');

const createSupplierSchema = Joi.object({
  rut_supplier: Joi.string()
    .max(12)
    .required()
    .messages({
      'string.max': 'El RUT del proveedor no puede exceder los 12 caracteres.',
      'any.required': 'El RUT del proveedor es obligatorio.',
    }),
  name_supplier: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.max': 'El nombre del proveedor no puede exceder los 50 caracteres.',
      'any.required': 'El nombre del proveedor es obligatorio.',
    }),
  email_supplier: Joi.string()
    .email()
    .allow('')
    .optional()
    .messages({
      'string.email': 'El correo debe ser válido.',
    }),
  phone_supplier: Joi.string()
    .max(12)
    .required()
    .messages({
      'string.max': 'El teléfono no puede exceder los 12 caracteres.',
      'any.required': 'El teléfono del proveedor es obligatorio.',
    }),
  address_supplier: Joi.string()
    .allow('')
    .max(50)
    .optional()
    .messages({
      'string.max': 'La dirección no puede exceder los 50 caracteres.',
    }),
});

const updateSupplierSchema = Joi.object({
  rut_supplier: Joi.string()
    .max(12)
    .optional(),
  name_supplier: Joi.string()
    .max(50)
    .optional(),
  email_supplier: Joi.string()
    .email()
    .allow('')
    .optional(),
  phone_supplier: Joi.string()
    .max(12)
    .optional(),
  address_supplier: Joi.string()
    .allow('')
    .max(50)
    .optional(),
});

module.exports = {
  createSupplierSchema,
  updateSupplierSchema,
};
