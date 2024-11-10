createUserSchema = require('../validations/user.validation');

const validateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res
      .status(400)
      .json({ message: 'Errores de validación', errors: messages });
  }
  next();
};

module.exports = {
  validateUser,
};
