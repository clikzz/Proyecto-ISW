const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, getTransactionsSummary, updateTransaction, deleteTransaction } = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateTransaction = require('../middleware/transaction.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin']));

router.get('/', getAllTransactions); // Ruta para obtener todas las transacciones
router.post('/', validateTransaction, createTransaction); // Ruta para crear una nueva transacción
router.get('/summary', getTransactionsSummary); // Ruta para obtener el resumen de transacciones
router.put('/:id_transaction', validateTransaction, updateTransaction); // Ruta para actualizar una transacción específica
router.delete('/:id_transaction', deleteTransaction); // Ruta para eliminar una transacción específica

module.exports = router;
