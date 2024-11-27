const { createServiceSchema, updateServiceSchema } = require('../validations/service.validation');

const validateCreateService = (req, res, next) => {
  const { error } = createServiceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

const validateUpdateService = (req, res, next) => {
  const { error } = updateServiceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = {
  validateCreateService,
  validateUpdateService,
};
