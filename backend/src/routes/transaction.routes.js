// routes/transaction.js
const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, getTransactionsSummary } = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateTransaction = require('../middleware/transaction.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin']));

router.get('/', getAllTransactions);
router.post('/', validateTransaction, createTransaction);
router.get('/summary', getTransactionsSummary);

module.exports = router;
