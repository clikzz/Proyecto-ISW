const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

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

      // Registrar el detalle de compra para producto existente
      await Inventory.createTransactionDetails(transactionId, item, 'compra');
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

const updateSale = async (transactionId, updatedItems, updatedDetails) => {
  if (updatedDetails) {
    await Inventory.updateTransactionDetails(transactionId, updatedDetails);
  }

  if (updatedItems && updatedItems.length > 0) {
    for (const item of updatedItems) {
      const existingItem = await Inventory.getTransactionItemById(item.id_transaction_item);

      // Si cambia la cantidad, ajustar el stock
      if (item.quantity_item !== existingItem.quantity_item) {
        const difference = item.quantity_item - existingItem.quantity_item;
        const operation = difference > 0 ? 'subtract' : 'add';
        await Item.updateStock(existingItem.id_item, Math.abs(difference), operation);
      }

      // Actualizar los detalles del ítem
      await Inventory.updateTransactionItem(item.id_transaction_item, item);
    }
  }

  return await Inventory.getSales(transactionId); // Retorna los datos actualizados
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
  updateSale,
  getPurchases,
  getSales,
};
