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
        description: item.description || 'Producto creado mediante compra',
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
  // Validar stock de todos los productos antes de crear la transacción
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

const updatePurchase = async (transactionId, updatedDetails, updatedItems) => {
  if (!transactionId) {
    throw new Error('El ID de la transacción es obligatorio');
  }

  // Actualizar los detalles de la transacción si existen cambios
  if (updatedDetails) {
    await Inventory.updateTransactionDetails(transactionId, updatedDetails);
  }

  // Actualizar los ítems si hay modificaciones
  if (updatedItems && updatedItems.length > 0) {
    for (const updatedItem of updatedItems) {
      const existingItem = await Inventory.getTransactionItemById(updatedItem.id_transaction_item);

      // Si la cantidad cambia, ajustar el stock
      if (updatedItem.quantity_item !== existingItem.quantity_item) {
        const difference = updatedItem.quantity_item - existingItem.quantity_item;
        const operation = difference > 0 ? 'add' : 'subtract';

        await Item.updateStock(existingItem.id_item, Math.abs(difference), operation);
      }

      // Actualizar los detalles del ítem
      await Inventory.updateTransactionItem(updatedItem.id_transaction_item, updatedItem);
    }
  }

  // Retornar los detalles actualizados
  const updatedTransactionItems = await Inventory.getTransactionItems(transactionId);
  return {
    transactionId,
    updatedItems: updatedTransactionItems,
  };
};

const deleteSale = async (transactionId) => {
  // Validar existencia y estado de la transacción
  const transaction = await Inventory.getSales().then((sales) =>
    sales.find((sale) => sale.id_transaction === Number(transactionId))
  );
  if (!transaction) {
    throw new Error('La transacción no existe');
  }
  if (transaction.is_deleted) {
    throw new Error('La transacción ya ha sido eliminada');
  }

  // Obtener todos los ítems de la transacción
  const transactionItems = await Inventory.getTransactionItems(transactionId);

  // Revertir el stock de cada ítem
  for (const item of transactionItems) {
    await Item.updateStock(item.id_item, item.quantity_item, 'add');
  }

  // Marcar la transacción como eliminada
  const updatedTransaction = await Inventory.softDeleteTransaction(transactionId);

  return updatedTransaction;
};

const deletePurchase = async (transactionId) => {
  // Validar la existencia de la compra
  const transaction = await Inventory.getPurchases().then((purchases) =>
    purchases.find((purchase) => purchase.id_transaction === Number(transactionId))
  );

  if (!transaction) {
    throw new Error('La transacción no existe');
  }
  if (transaction.is_deleted) {
    throw new Error('La transacción ya ha sido eliminada');
  }

  // Obtener los ítems de la transacción
  const transactionItems = await Inventory.getTransactionItems(transactionId);

  // Revertir el stock de cada ítem
  for (const item of transactionItems) {
    try {
      await Item.updateStock(item.id_item, item.quantity_item, 'subtract');

      // Revisar si el proveedor tiene otras compras activas
      const activeTransactions = await Inventory.getActiveTransactionsByItemAndSupplier(
        item.id_item,
        item.rut_supplier
      );

      if (activeTransactions.length === 0) {
        // Si no hay más compras activas, eliminar la relación proveedor-producto
        await ItemSupplier.removeSupplierFromItem(item.id_item, item.rut_supplier);
      }
    } catch (error) {
      console.error(`Error al procesar el ítem ${item.id_item}:`, error);
      throw new Error(`Error al revertir el stock o eliminar proveedor del ítem ${item.id_item}`);
    }
  }

  // Marcar la transacción como eliminada
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
