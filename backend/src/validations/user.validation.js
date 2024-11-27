const Joi = require('joi');
const {
  validarDigitoVerificador,
  limpiarRut,
} = require('../helpers/validateRut');

const createUserSchema = Joi.object({
  rut: Joi.string()
    .pattern(/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/)
    .required()
    .custom((value, helpers) => {
      const rutLimpio = limpiarRut(value);
      const rutSinDv = parseInt(rutLimpio.slice(0, -1), 10);

      if (rutSinDv > 29999999) {
        return helpers.error('rut.limite', {
          message: 'El RUT excede el límite de 29.999.999-9',
        });
      }

      const rutFormateado = `${rutLimpio.slice(0, -1)}-${rutLimpio.slice(-1)}`;
      if (!validarDigitoVerificador(rutFormateado)) {
        return helpers.error('rut.dv', {
          message: 'El RUT tiene un dígito verificador inválido',
        });
      }

      return value;
    })
    .messages({
      'string.pattern.base':
        'El RUT no tiene un formato válido. Ej: 12.345.678-9',
      'any.required': 'El RUT es obligatorio',
      'rut.limite': 'El RUT excede el límite permitido de 29.999.999-9',
      'rut.dv': 'El RUT tiene un dígito verificador inválido',
    }),
  name_user: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'El nombre debe ser de tipo texto',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede tener más de 30 caracteres',
      'any.required': 'El nombre es obligatorio',
      'string.pattern.base': 'El nombre solo puede contener letras',
    }),
  email: Joi.string()
    .pattern(/^[\w\.-]+@([\w-]+\.)+[\w-]{2,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'El email debe tener un formato válido. Ej: usuario@dominio.com o usuario@sub.dominio.com',
      'any.required': 'El email es obligatorio',
    }),
});

module.exports = createUserSchema;
