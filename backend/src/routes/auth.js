const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Ruta protegida
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

module.exports = router;
