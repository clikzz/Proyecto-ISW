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

exports.getPurchases = async (req, res) => {
  try {
    const purchases = await inventoryService.getPurchases();
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ message: 'Error al obtener compras' });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await inventoryService.getSales();
    res.status(200).json(sales);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};