const express = require('express');
const router = express.Router();
const transactionServiceController = require('../controllers/transactionService.controller');

router.post('/create', transactionServiceController.createTransaction);
router.get('/all', transactionServiceController.getTransactions);

module.exports = router;
