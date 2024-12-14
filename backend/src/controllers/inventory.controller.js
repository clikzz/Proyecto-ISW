const inventoryService = require('../services/inventory.service');

exports.createPurchase = async (req, res) => {
  console.log('Datos recibidos (compra):', req.body);
  const { items, details } = req.body;

  try {
    const transactionDetails = {
      ...details,
      rut: req.user.rut, // Rut del usuario autenticado
    };

    const transactionId = await inventoryService.createPurchase(items, transactionDetails);
    res.status(201).json({ message: 'Compra registrada exitosamente', transactionId });
  } catch (error) {
    console.error('Error al registrar la compra:', error);
    res.status(500).json({ message: 'Error al registrar la compra', error: error.message });
  }
};

exports.createSale = async (req, res) => {
  console.log('Datos recibidos (venta):', req.body);
  const { items, details } = req.body;

  try {
    const transactionDetails = {
      ...details,
      rut: req.user.rut, // Rut del usuario autenticado
    };

    const transactionId = await inventoryService.createSale(items, transactionDetails);
    res.status(201).json({ message: 'Venta registrada exitosamente', transactionId });
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ message: 'Error al registrar la venta', error: error.message });
  }
};

exports.updateSale = async (req, res) => {
  const { id_transaction } = req.params;
  const { items, details } = req.body;

  try {
    const updatedSale = await inventoryService.updateSale(id_transaction, items, details);
    res.status(200).json({ message: 'Venta actualizada exitosamente', updatedSale });
  } catch (error) {
    console.error('Error al actualizar la venta:', error);
    res.status(500).json({ message: 'Error al actualizar la venta', error: error.message });
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

exports.deletePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurchase = await inventoryService.deletePurchase(id);
    res.status(200).json({ message: 'Compra eliminada exitosamente', deletedPurchase });
  } catch (error) {
    console.error('Error al eliminar la compra:', error);
    res.status(500).json({ message: 'Error al eliminar la compra', error: error.message });
  }
};


exports.deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSale = await inventoryService.deleteSale(id);
    res.status(200).json({ message: 'Venta eliminada exitosamente', deletedSale });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ message: 'Error al eliminar la venta', error: error.message });
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