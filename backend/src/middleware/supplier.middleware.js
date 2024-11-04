const { createSupplierSchema, updateSupplierSchema } = require('../validations/supplier.validation');

const validateCreateSupplier = (req, res, next) => {
  const { error } = createSupplierSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

const validateUpdateSupplier = (req, res, next) => {
  const { error } = updateSupplierSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = { validateCreateSupplier, validateUpdateSupplier };