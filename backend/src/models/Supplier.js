const db = require('../config/db');

class Supplier {
  static async create(data) {
    const query = `
      INSERT INTO supplier (rut_supplier, name_supplier, email_supplier, phone_supplier, address_supplier)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.rut_supplier,
      data.name_supplier,
      data.email_supplier,
      data.phone_supplier,
      data.address_supplier,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM supplier');
    return result.rows;
  }

  static async findById(rut_supplier) {
    const result = await db.query('SELECT * FROM supplier WHERE rut_supplier = $1', [rut_supplier]);
    return result.rows[0];
  }

  static async update(rut_supplier, data) {
    const query = `
      UPDATE supplier
      SET name_supplier = $1, email_supplier = $2, phone_supplier = $3, address_supplier = $4, updated_at = CURRENT_TIMESTAMP
      WHERE rut_supplier = $5
      RETURNING *;
    `;
    const values = [
      data.name_supplier,
      data.email_supplier,
      data.phone_supplier,
      data.address_supplier,
      rut_supplier,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(rut_supplier) {
    const result = await db.query('DELETE FROM supplier WHERE rut_supplier = $1 RETURNING *', [rut_supplier]);
    return result.rows[0];
  }
}

module.exports = Supplier;
