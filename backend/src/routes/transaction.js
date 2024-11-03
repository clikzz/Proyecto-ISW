const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, getTransactionsSummary } = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Definir las rutas y asignar los controladores correspondientes
router.get('/', authMiddleware, getAllTransactions);
router.post('/', authMiddleware, createTransaction);
router.get('/summary', authMiddleware, getTransactionsSummary);

module.exports = router;
