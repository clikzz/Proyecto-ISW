const { validateProfileUpdate, validatePasswordChange } = require('../validations/profile.validation');

const validateProfileUpdateMiddleware = (req, res, next) => {
  const { error } = validateProfileUpdate.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

const validatePasswordChangeMiddleware = (req, res, next) => {
  const { error } = validatePasswordChange.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = {
  validateProfileUpdateMiddleware,
  validatePasswordChangeMiddleware,
};