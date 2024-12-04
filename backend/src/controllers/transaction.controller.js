const Transaction = require('../models/Transaction');
const createTransactionSchema = require('../validations/transaction.validation');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.getAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { rut } = req.user; // Obtenemos el RUT del usuario autenticado
    const transactionData = { ...req.body, rut };

    console.log('Datos de la transacción antes de la validación:', transactionData);

    const { error } = createTransactionSchema.validate(transactionData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newTransaction = await Transaction.create(transactionData);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción: ' + error.message });
  }
};

const getTransactionsSummary = async (req, res) => {
  try {
    const result = await Transaction.getSummary();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el resumen de transacciones' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id_transaction } = req.params;
    const result = await Transaction.delete(id_transaction);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.status(200).json({ message: 'Transacción eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la transacción:', error);
    res.status(500).json({ error: 'Error al eliminar la transacción' });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionsSummary,
  deleteTransaction,
};
