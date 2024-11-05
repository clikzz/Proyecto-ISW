const db = require('../config/db');

class Inventory {
  static async createTransaction(type, items, details) {
    const transactionQuery = `
      INSERT INTO transaccion (rut, tipo, monto, fecha, metodo_pago, descripcion)
      VALUES ($1, $2, $3, NOW(), $4, $5)
      RETURNING id_transaccion;
    `;

    const transactionValues = [
      details.rut,
      type,
      details.monto,
      details.metodo_pago,
      details.descripcion,
    ];

    const result = await db.query(transactionQuery, transactionValues);
    const transactionId = result.rows[0].id_transaccion;

    for (let item of items) {
      const itemQuery = `
        INSERT INTO transaction_item (id_transaccion, id_item, cantidad_item, precio_unitario)
        VALUES ($1, $2, $3, $4);
      `;

      const itemValues = [
        transactionId,
        item.id_item,
        item.cantidad,
        item.precio_unitario,
      ];

      await db.query(itemQuery, itemValues);

      const updateStockQuery = `
        UPDATE item
        SET stock = stock ${type === 'venta' ? '-' : '+'} $1
        WHERE id_item = $2;
      `;

      await db.query(updateStockQuery, [item.cantidad, item.id_item]);
    }

    return transactionId;
  }
}

module.exports = Inventory;
