const { createItem, updateItem } = require('../validations/item.validation');

const validateCreateItem = (req, res, next) => {
  const { error } = createItem.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

const validateUpdateItem = (req, res, next) => {
  const { error } = updateItem.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = {
  validateCreateItem,
  validateUpdateItem,
};
