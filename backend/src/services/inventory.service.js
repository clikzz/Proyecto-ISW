const Inventory = require('../models/Inventory');

const createTransaction = async (type, items, details) => {
  return await Inventory.createTransaction(type, items, details);
};

const getPurchases = async () => {
  return await Inventory.getPurchases();
};

const getSales = async () => {
  return await Inventory.getSales();
};

module.exports = {
  createTransaction,
  getPurchases,
  getSales,
};
