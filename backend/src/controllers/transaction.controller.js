const Transaction = require('../models/Transaction');

const getAllTransactions = async (req, res) => {
  const { rut } = req.user; // Obtener el rut del usuario autenticado
  try {
    const transactions = await Transaction.getAll(rut);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones' });
  }
};

const createTransaction = async (req, res) => {
  const { rut } = req.user; // Obtener el rut del usuario autenticado
  const transactionData = { ...req.body, rut };
  try {
    const newTransaction = await Transaction.create(transactionData);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
};

const getTransactionsSummary = async (req, res) => {
  const { rut } = req.user; // Obtener el rut del usuario autenticado
  try {
    const result = await Transaction.getSummary(rut);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el resumen de transacciones' });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionsSummary,
};
