const Inventory = require('../models/Inventory');
const Item = require('../models/Item');

const createTransaction = async (type, items, details) => {
  const transactionId = await Inventory.createTransactionEntry(details);

  for (const item of items) {
    let itemData = await Item.findById(item.id_item);

    if (!itemData) {
      itemData = await Item.findByName(item.name_item);
    }

    if (!itemData) {
      itemData = await Item.create({
        rut_supplier: details.rut_supplier || null,
        name_item: item.name_item,
        description: item.description || 'Ítem creado automáticamente',
        category: item.category || 'Sin Categoría',
        stock: 0,
        cost_price: 0,
        selling_price: item.selling_price || 0,
      });
    }

    if (type === 'venta') {
      await Item.updateStock(itemData.id_item, item.quantity, 'subtract');
      item.unit_price = itemData.selling_price;
    } else if (type === 'compra') {
      await Item.updateStock(itemData.id_item, item.quantity, 'add');
    }

    await Inventory.createTransactionDetails(transactionId, {
      id_item: itemData.id_item,
      quantity: item.quantity,
      unit_price: item.unit_price,
    });
  }

  return transactionId;
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
