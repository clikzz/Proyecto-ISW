const db = require('../config/db');

class Item {
  static async create(data) {
    const query = `
      INSERT INTO item (rut_supplier, name_item, description, category, stock, cost_price, selling_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.rut_supplier, data.name_item, data.description, data.category,
      data.stock, data.cost_price, data.selling_price,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM item');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM item WHERE id_item = $1', [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE item
      SET rut_supplier = $1, name_item = $2, description = $3, category = $4,
          stock = $5, cost_price = $6, selling_price = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id_item = $8
      RETURNING *;
    `;
    const values = [
      data.rut_supplier, data.name_item, data.description, data.category,
      data.stock, data.cost_price, data.selling_price, id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM item WHERE id_item = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Item;
