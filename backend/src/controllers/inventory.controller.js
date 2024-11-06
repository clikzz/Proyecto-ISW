const inventoryService = require('../services/inventory.service');

exports.createTransaction = async (req, res) => {
  const { type, items, details } = req.body;

  try {
    const transactionId = await inventoryService.createTransaction(type, items, details);
    res.status(201).json({ message: 'Transacción creada exitosamente', transactionId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la transacción', error: error.message });
  }
};
