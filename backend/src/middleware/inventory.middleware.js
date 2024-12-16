const { purchaseSchema, editPurchaseSchema, saleSchema, editSaleSchema } = require('../validations/inventory.validation');

const validatePurchase = (req, res, next) => {
  const { error } = purchaseSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

const validateEditPurchase = (req, res, next) => {
  const { error } = editPurchaseSchema.validate(req.body, { abortEarly: false });
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

const validateEditSale = (req, res, next) => {
  const { error } = editSaleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = { validatePurchase, validateEditPurchase, validateSale, validateEditSale };
