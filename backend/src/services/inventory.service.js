const Inventory = require('../models/Inventory');
const Item = require('../models/Item');

const createTransaction = async (type, items, details) => {
  const transactionId = await Inventory.createTransaction({
    ...details,
    type,
  });

  for (const item of items) {
    if (type === 'venta') {
      await Inventory.validateStock(item.id_item, item.quantity);
      await Item.updateStock(item.id_item, item.quantity, 'subtract');
    } else if (type === 'compra') {
      let existingItem = await Item.findById(item.id_item);

      if (existingItem) {
        await Item.updateStock(item.id_item, item.quantity, 'add');
      } else {
        const newItem = await Item.create({
          rut_supplier: item.rut_supplier,
          name_item: item.name_item,
          description: item.description || 'Ítem creado mediante compra',
          category: item.category || 'General',
          stock: item.quantity,
          selling_price: item.selling_price || 0,
        });
        item.id_item = newItem.id_item;
      }
    }

    await Inventory.createTransactionDetails(transactionId, {
      id_item: item.id_item,
      quantity: item.quantity,
      unit_price: item.unit_price || (await Item.findById(item.id_item)).selling_price,
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
