const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/authValidation.middleware');

// Rutas de autenticación
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/validate-token', authMiddleware, authController.validateToken);

module.exports = router;
