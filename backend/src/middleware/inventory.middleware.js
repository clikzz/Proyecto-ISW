const { purchaseSchema, saleSchema } = require('../validations/inventory.validation');

const validatePurchase = (req, res, next) => {
  const { error } = purchaseSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

const validateSale = (req, res, next) => {
  const { error } = saleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = { validatePurchase, validateSale };
