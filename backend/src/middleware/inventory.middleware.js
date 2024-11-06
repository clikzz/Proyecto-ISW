const { inventorySchema } = require('../validations/inventory.validation');

const validateInventory = (req, res, next) => {
  const { error } = inventorySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = { validateInventory };
