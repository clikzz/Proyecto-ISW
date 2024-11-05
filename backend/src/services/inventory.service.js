const Inventory = require('../models/Inventory');

const createTransaction = async (type, items, details) => {
  return await Inventory.createTransaction(type, items, details);
};

module.exports = {
  createTransaction,
};
