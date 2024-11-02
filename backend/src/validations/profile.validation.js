const { body } = require('express-validator');

exports.validateProfileUpdate = [
  body('name_user').isString().withMessage('El nombre es requerido'),
  body('phone_user').optional().isString().withMessage('Teléfono inválido'),
  body('rut').not().exists().withMessage('El rut no se puede modificar'),
];

exports.validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Contraseña actual requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  body('confirmPassword').custom((value, { req }) => value === req.body.newPassword).withMessage('Las contraseñas no coinciden'),
];
