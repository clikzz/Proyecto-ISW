const inventoryService = require('../services/inventory.service');

exports.createTransaction = async (req, res) => {
  const { type, items, details } = req.body;

  try {
    if (type !== 'venta' && type !== 'compra') {
      return res.status(400).json({ message: 'Tipo de transacción inválido' });
    }

    const transactionDetails = {
      ...details,
      rut: req.user.rut,
      type,
    };

    const transactionId = await inventoryService.createTransaction(type, items, transactionDetails);
    res.status(201).json({ message: 'Transacción registrada exitosamente', transactionId });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la transacción', error: error.message });
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