const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const ItemSupplier = require('../models/ItemSupplier');

const createPurchase = async (items, details) => {
  const transactionId = await Inventory.createTransaction({
    ...details,
    type: 'compra',
  });

  for (const item of items) {
    let existingItem = await Item.findById(item.id_item);

    if (existingItem) {
      await Item.updateStock(item.id_item, item.quantity, 'add');

      if (item.rut_supplier) {
        await Inventory.updateSupplier(item.id_item, item.rut_supplier, item.unit_price);
      }

      await Inventory.createTransactionDetails(transactionId, item, 'compra');
    } else {
      const newItem = await Item.create({
        rut_supplier: item.rut_supplier,
        name_item: item.name_item,
        description: item.description || 'Producto creado mediante compra',
        category: item.category || 'otros',
        stock: item.quantity,
        selling_price: item.selling_price || 0,
      });
      item.id_item = newItem.id_item;

      await Inventory.createTransactionDetails(transactionId, item, 'compra');
    }
  }

  return transactionId;
};

const createSale = async (items, details) => {
  for (const item of items) {
    const product = await Inventory.validateStock(item.id_item);
    if (product.stock < item.quantity) {
      throw new Error(
        `Stock insuficiente (${product.stock}) para el producto ${product.name_item}`
      );
    }
  }
  
  const transactionId = await Inventory.createTransaction({
    ...details,
    type: 'venta',
  });

  for (const item of items) {
    await Item.updateStock(item.id_item, item.quantity, 'subtract');
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

      if (item.quantity_item !== existingItem.quantity_item) {
        const difference = item.quantity_item - existingItem.quantity_item;
        const operation = difference > 0 ? 'subtract' : 'add';
        await Item.updateStock(existingItem.id_item, Math.abs(difference), operation);
      }

      await Inventory.updateTransactionItem(item.id_transaction_item, item);
    }
  }

  return await Inventory.getSales(transactionId);
};

const updatePurchase = async (transactionId, updatedDetails, updatedItems) => {
  if (!transactionId) {
    throw new Error('El ID de la transacción es obligatorio');
  }

  if (updatedDetails) {
    await Inventory.updateTransactionDetails(transactionId, updatedDetails);
  }

  if (updatedItems && updatedItems.length > 0) {
    for (const updatedItem of updatedItems) {
      const existingItem = await Inventory.getTransactionItemById(updatedItem.id_transaction_item);

      if (updatedItem.quantity_item !== existingItem.quantity_item) {
        const difference = updatedItem.quantity_item - existingItem.quantity_item;
        const operation = difference > 0 ? 'add' : 'subtract';

        await Item.updateStock(existingItem.id_item, Math.abs(difference), operation);
      }

      await Inventory.updateTransactionItem(updatedItem.id_transaction_item, updatedItem);
    }
  }

  const updatedTransactionItems = await Inventory.getTransactionItems(transactionId);
  return {
    transactionId,
    updatedItems: updatedTransactionItems,
  };
};

const deleteSale = async (transactionId) => {
  const transaction = await Inventory.getSales().then((sales) =>
    sales.find((sale) => sale.id_transaction === Number(transactionId))
  );
  if (!transaction) {
    throw new Error('La transacción no existe');
  }
  if (transaction.is_deleted) {
    throw new Error('La transacción ya ha sido eliminada');
  }

  const transactionItems = await Inventory.getTransactionItems(transactionId);

  for (const item of transactionItems) {
    await Item.updateStock(item.id_item, item.quantity_item, 'add');
  }

  const updatedTransaction = await Inventory.softDeleteTransaction(transactionId);

  return updatedTransaction;
};

const deletePurchase = async (transactionId) => {
  const transaction = await Inventory.getPurchases().then((purchases) =>
    purchases.find((purchase) => purchase.id_transaction === Number(transactionId))
  );

  if (!transaction) {
    throw new Error('La transacción no existe');
  }
  if (transaction.is_deleted) {
    throw new Error('La transacción ya ha sido eliminada');
  }

  const transactionItems = await Inventory.getTransactionItems(transactionId);

  for (const item of transactionItems) {
    try {
      await Item.updateStock(item.id_item, item.quantity_item, 'subtract');

      const activeTransactions = await Inventory.getActiveTransactionsByItemAndSupplier(
        item.id_item,
        item.rut_supplier
      );

      if (activeTransactions.length === 0) {
        await ItemSupplier.removeSupplierFromItem(item.id_item, item.rut_supplier);
      }
    } catch (error) {
      console.error(`Error al procesar el ítem ${item.id_item}:`, error);
      throw new Error(`Error al revertir el stock o eliminar proveedor del ítem ${item.id_item}`);
    }
  }

  const updatedTransaction = await Inventory.softDeleteTransaction(transactionId);

  return updatedTransaction;
};

const getPurchases = async () => {
  return await Inventory.getPurchases();
};

const getSales = async () => {
  return await Inventory.getSales();
};

module.exports = {
  createPurchase,
  deletePurchase,
  updatePurchase,
  createSale,
  updateSale,
  deleteSale,
  getPurchases,
  getSales,
};
