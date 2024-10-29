const Joi = require('joi');

const validarDigitoVerificador = (rutCompleto) => {
  const [rut, dv] = rutCompleto.split('-');
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += multiplicador * parseInt(rut[i], 10);
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const resto = suma % 11;
  const dvCalculado = 11 - resto === 11 ? '0' : 11 - resto === 10 ? 'k' : `${11 - resto}`;

  return dv.toLowerCase() === dvCalculado;
};

const limpiarRut = (rut) => rut.replace(/\./g, '').replace('-', '');

const registerSchema = Joi.object({
  rut: Joi.string()
    .pattern(/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/)
    .required()
    .custom((value, helpers) => {
      const rutLimpio = limpiarRut(value);
      const rutSinDv = parseInt(rutLimpio.slice(0, -1), 10);

      if (rutSinDv > 29999999) {
        return helpers.error('rut.limite', { message: 'El RUT excede el límite de 29.999.999-9' });
      }

      const rutFormateado = `${rutLimpio.slice(0, -1)}-${rutLimpio.slice(-1)}`;
      if (!validarDigitoVerificador(rutFormateado)) {
        return helpers.error('rut.dv', { message: 'El RUT tiene un dígito verificador inválido' });
      }

      return value;
    })
    .messages({
      'string.pattern.base': 'El RUT no tiene un formato válido. Ej: 12.345.678-9',
      'any.required': 'El RUT es obligatorio',
      'rut.limite': 'El RUT excede el límite permitido de 29.999.999-9',
      'rut.dv': 'El RUT tiene un dígito verificador inválido',
    }),
  name_user: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede tener más de 30 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),
  email: Joi.string()
    .pattern(/^[\w\.-]+@([\w-]+\.)+[\w-]{2,}$/)
    .required()
    .messages({
      'string.pattern.base': 'El email debe tener un formato válido. Ej: usuario@dominio.com o usuario@sub.dominio.com',
      'any.required': 'El email es obligatorio',
    }),
  password_user: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una letra y un número',
      'any.required': 'La contraseña es obligatoria',
    }),
});

module.exports = registerSchema;
