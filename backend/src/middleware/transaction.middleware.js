// transaction.middleware.js
const createTransactionSchema = require('../validations/transaction.validation');

const validateTransaction = (req, res, next) => {
  const { error } = createTransactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateTransaction;
