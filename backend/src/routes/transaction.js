// routes/transaction.js
const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, getTransactionsSummary } = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateTransaction = require('../middleware/transaction.middleware');

router.get('/', authMiddleware, getAllTransactions);
router.post('/', authMiddleware, validateTransaction, createTransaction);
router.get('/summary', authMiddleware, getTransactionsSummary);

module.exports = router;
