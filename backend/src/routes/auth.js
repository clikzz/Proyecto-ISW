const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

module.exports = router;
