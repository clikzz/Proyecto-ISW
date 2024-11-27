const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const transactionServiceController = require('../controllers/transactionService.controller');

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin', 'employee']));

router.post('/create', transactionServiceController.createTransaction);
router.get('/all', transactionServiceController.getTransactions);

module.exports = router;
