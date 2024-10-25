const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

module.exports = router;
