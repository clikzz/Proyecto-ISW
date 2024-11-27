const TransactionService = require('../models/TransactionService');

const createTransaction = async (data) => await TransactionService.create(data);
const getAllTransactions = async () => await TransactionService.findAll();

module.exports = {
  createTransaction,
  getAllTransactions,
};
