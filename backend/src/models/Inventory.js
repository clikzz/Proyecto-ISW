const db = require('../config/db');

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

  static async createTransactionDetails(transactionId, item) {
    const query = `
      INSERT INTO transaction_item (id_transaction, id_item, quantity_item, unit_price)
      VALUES ($1, $2, $3, $4);
    `;
    await db.query(query, [transactionId, item.id_item, item.quantity, item.unit_price]);
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
        i.rut_supplier,
        s.name_supplier,
        i.name_item
      FROM 
        transaction t
      JOIN 
        transaction_item ti ON t.id_transaction = ti.id_transaction
      JOIN 
        item i ON ti.id_item = i.id_item
      LEFT JOIN
        supplier s ON i.rut_supplier = s.rut_supplier
      WHERE 
        t.transaction_type = 'compra'
      ORDER BY 
        t.transaction_date DESC;
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
        i.name_item
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
        t.transaction_type = 'venta' 
      ORDER BY 
        t.transaction_date DESC;
    `;
  
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Inventory;