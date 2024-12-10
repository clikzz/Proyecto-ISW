const Inventory = require('../models/Inventory');
const Item = require('../models/Item');

const createPurchase = async (items, details) => {
  const transactionId = await Inventory.createTransaction({
    ...details,
    type: 'compra',
  });

  for (const item of items) {
    let existingItem = await Item.findById(item.id_item);

    if (existingItem) {
      // Producto existente: renovar stock
      await Item.updateStock(item.id_item, item.quantity, 'add');

      // Actualizar relación con el proveedor en caso de ser un proveedor nuevo
      if (item.rut_supplier) {
        await Inventory.updateSupplier(item.id_item, item.rut_supplier, item.unit_price);
      }
    } else {
      // Producto nuevo: crear el producto
      const newItem = await Item.create({
        rut_supplier: item.rut_supplier,
        name_item: item.name_item,
        description: item.description || 'Ítem creado mediante compra',
        category: item.category || 'otros',
        stock: item.quantity,
        selling_price: item.selling_price || 0,
      });
      item.id_item = newItem.id_item;

      // Crear relación con el proveedor
      await Inventory.createTransactionDetails(transactionId, item, 'compra');
    }
  }

  return transactionId;
};

const createSale = async (items, details) => {
  const transactionId = await Inventory.createTransaction({
    ...details,
    type: 'venta',
  });

  for (const item of items) {
    // Validar el stock sufienciente antes de realizar la venta
    await Inventory.validateStock(item.id_item, item.quantity);
    // Reducir el stock
    await Item.updateStock(item.id_item, item.quantity, 'subtract');
    // Crear el detalle de la transaccion
    await Inventory.createTransactionDetails(transactionId, item, 'venta');
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
  createPurchase,
  createSale,
  getPurchases,
  getSales,
};
