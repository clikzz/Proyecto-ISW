const Transaction = require('../models/Transaction');

class TransactionService {
  async getAllTransactions(rut) {
    try {
      return await Transaction.getAll(rut);
    } catch (error) {
      throw new Error('Error al obtener transacciones: ' + error.message);
    }
  }

  async createTransaction(transactionData) {
    try {
      return await Transaction.create(transactionData);
    } catch (error) {
      throw new Error('Error al crear transacción: ' + error.message);
    }
  }

  async getTransactionById(id) {
    try {
      return await Transaction.getById(id);
    } catch (error) {
      throw new Error('Error al obtener transacción por ID: ' + error.message);
    }
  }

  async updateTransaction(id, transactionData) {
    try {
      return await Transaction.update(id, transactionData);
    } catch (error) {
      throw new Error('Error al actualizar transacción: ' + error.message);
    }
  }

  async deleteTransaction(id) {
    try {
      return await Transaction.delete(id);
    } catch (error) {
      throw new Error('Error al eliminar transacción: ' + error.message);
    }
  }

  async getTransactionsSummary(rut) {
    try {
      return await Transaction.getSummary(rut);
    } catch (error) {
      throw new Error('Error al obtener resumen de transacciones: ' + error.message);
    }
  }
}

const createSale = async (saleData) => {
  return await Transaction.createSale(saleData);
};

const createPurchase = async (purchaseData) => {
  return await Transaction.createPurchase(purchaseData);
};

module.exports = {
  TransactionService,
  createSale,
  createPurchase,
};
