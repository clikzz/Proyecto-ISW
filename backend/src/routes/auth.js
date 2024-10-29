const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../middleware/authValidation.middleware');

// Rutas de autenticación
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Ruta protegida
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

module.exports = router;
