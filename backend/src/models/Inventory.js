const db = require('../config/db');
const ItemSupplier = require('./ItemSupplier');

class Inventory {
  static async createTransaction(details) {
    const query = `
      INSERT INTO transaction (rut, transaction_type, amount, transaction_date, payment_method, description)
      VALUES ($1, $2, $3, NOW(), $4, $5)
      RETURNING id_transaction;
    `;
    const values = [
      details.rut,
      details.type,
      details.amount,
      details.payment_method,
      details.description
    ];
    const result = await db.query(query, values);
    return result.rows[0].id_transaction;
  }

  static async createTransactionDetails(transactionId, item, type) {
    console.log('Item antes de insertar en la BD:', item);
    const query = `
      INSERT INTO transaction_item (id_transaction, id_item, quantity_item, unit_price, rut_supplier)
      VALUES ($1, $2, $3, $4, $5);
    `;
    await db.query(query, [transactionId, item.id_item, item.quantity, item.unit_price, item.rut_supplier || null]);
  
    if (type === 'compra' && item.rut_supplier) {
      await ItemSupplier.addItemSupplier({
        id_item: item.id_item,
        rut_supplier: item.rut_supplier,
        purchase_price: item.unit_price,
        purchase_date: new Date(),
      });
    }
  }

  static async validateStock(itemId, quantity) {
    const query = `
      SELECT stock FROM item
      WHERE id_item = $1 AND is_deleted = FALSE;
    `;
    const result = await db.query(query, [itemId]);
    if (result.rowCount === 0 || result.rows[0].stock < quantity) {
      throw new Error(`Stock insuficiente para el ítem con ID ${itemId}`);
    }
    return true;
  }

  static async updateSupplier(idItem, rutSupplier, purchasePrice) {
    const existing = await db.query(
      `SELECT * FROM item_supplier WHERE id_item = $1 AND rut_supplier = $2`,
      [idItem, rutSupplier]
    );
  
    if (existing.rowCount === 0) {
      await db.query(
        `INSERT INTO item_supplier (id_item, rut_supplier, purchase_price, purchase_date)
        VALUES ($1, $2, $3, NOW())`,
        [idItem, rutSupplier, purchasePrice]
      );
    } else {
      await db.query(
        `UPDATE item_supplier
        SET purchase_price = $1, purchase_date = NOW()
        WHERE id_item = $2 AND rut_supplier = $3`,
        [purchasePrice, idItem, rutSupplier]
      );
    }
  }

  static async updateTransactionDetails(transactionId, updatedDetails) {
    const query = `
      UPDATE transaction
      SET amount = $1, payment_method = $2, description = $3, updated_at = NOW()
      WHERE id_transaction = $4
      RETURNING *;
    `;
    const values = [
      updatedDetails.amount,
      updatedDetails.payment_method,
      updatedDetails.description,
      transactionId,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateTransactionItem(transactionItemId, updatedItem) {
    const query = `
      UPDATE transaction_item
      SET quantity_item = $1, unit_price = $2, updated_at = NOW()
      WHERE id_transaction_item = $3
      RETURNING *;
    `;
    const values = [
      updatedItem.quantity_item,
      updatedItem.unit_price,
      transactionItemId,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getTransactionItems(transactionId) {
    const query = `
      SELECT 
        ti.id_transaction_item, 
        ti.id_item, 
        ti.quantity_item, 
        ti.unit_price,
        i.name_item
      FROM 
        transaction_item ti
      JOIN 
        item i 
      ON 
        ti.id_item = i.id_item
      JOIN
        transaction t
      ON
        ti.id_transaction = t.id_transaction
      WHERE 
        ti.id_transaction = $1 AND t.is_deleted = FALSE;
    `;
    const result = await db.query(query, [transactionId]);
    if (result.rows.length === 0) {
      throw new Error(`No se encontraron ítems para la transacción con ID ${transactionId}`);
    }
    return result.rows;
  }

  static async getTransactionItemById(id_transaction_item) {
    const query = `
      SELECT 
        ti.id_transaction_item, 
        ti.id_item, 
        ti.quantity_item, 
        ti.unit_price,
        i.name_item,
        t.amount
      FROM 
        transaction_item ti
      JOIN 
        item i 
      ON 
        ti.id_item = i.id_item
      JOIN 
        transaction t
      ON 
        ti.id_transaction = t.id_transaction
      WHERE 
        ti.id_transaction_item = $1 AND t.is_deleted = FALSE;
    `;
    const result = await db.query(query, [id_transaction_item]);
    if (result.rows.length === 0) {
      throw new Error(`No se encontró el ítem con id_transaction_item ${id_transaction_item}`);
    }
    return result.rows[0];
  }

  static async softDeleteTransaction(transactionId) {
    const query = `
      UPDATE transaction
      SET is_deleted = TRUE, updated_at = NOW()
      WHERE id_transaction = $1 AND is_deleted = FALSE
      RETURNING *;
    `;
    
    const result = await db.query(query, [transactionId]);
    
    if (result.rowCount === 0) {
      throw new Error(`La transacción con ID ${transactionId} no existe o ya ha sido eliminada`);
    }
  
    return result.rows[0];
  }

  static async getActiveTransactionsByItemAndSupplier(id_item, rut_supplier) {
    const query = `
      SELECT t.id_transaction
      FROM transaction t
      JOIN transaction_item ti ON t.id_transaction = ti.id_transaction
      WHERE ti.id_item = $1 AND ti.rut_supplier = $2 AND t.is_deleted = FALSE;
    `;
    const result = await db.query(query, [id_item, rut_supplier]);
    return result.rows;
  }  

  static async getPurchases() {
    const query = `
      SELECT
        t.id_transaction, 
        t.rut, 
        t.transaction_type, 
        t.amount, 
        t.transaction_date, 
        t.payment_method, 
        COALESCE(t.description, '') AS description,
        ti.id_item, 
        ti.quantity_item, 
        ti.unit_price,
        ti.id_transaction_item,
        s.name_supplier,
        i.name_item
      FROM 
        transaction t
      LEFT JOIN transaction_item ti ON t.id_transaction = ti.id_transaction
      LEFT JOIN supplier s ON ti.rut_supplier = s.rut_supplier
      LEFT JOIN item i ON ti.id_item = i.id_item
      WHERE t.transaction_type = 'compra' AND t.is_deleted = FALSE
      ORDER BY t.transaction_date DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  }

  static async getSales() {
    const query = `
      SELECT 
        t.id_transaction, 
        t.rut, 
        t.transaction_type, 
        t.amount, 
        t.transaction_date, 
        t.payment_method, 
        t.description,
        ti.id_item, 
        ti.quantity_item, 
        ti.unit_price, 
        ti.id_transaction_item,
        i.name_item,
        t.updated_at
      FROM 
        transaction t
      JOIN 
        transaction_item ti 
      ON 
        t.id_transaction = ti.id_transaction
      LEFT JOIN 
        item i 
      ON 
        ti.id_item = i.id_item
      WHERE 
        t.transaction_type = 'venta' AND t.is_deleted = FALSE
      ORDER BY 
        t.transaction_date DESC;
    `;
  
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Inventory;