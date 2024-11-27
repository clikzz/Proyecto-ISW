const transactionService = require('../services/transactionService.service');

exports.createTransaction = async (req, res) => {
  try {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la transacción', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las transacciones', error: err.message });
  }
};
