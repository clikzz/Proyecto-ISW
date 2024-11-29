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
    const result = await db.query(
      'SELECT * FROM supplier WHERE is_deleted = FALSE'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM supplier WHERE id = $1 AND is_deleted = FALSE',
      [id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE supplier
      SET rut_supplier = $1, name_supplier = $2, email_supplier = $3, phone_supplier = $4, address_supplier = $5, updated_at = CURRENT_TIMESTAMP
      WHERE rut_supplier = $6 AND is_deleted = FALSE
      RETURNING *;
    `;
    const values = [
      data.rut_supplier,
      data.name_supplier,
      data.email_supplier,
      data.phone_supplier,
      data.address_supplier,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    console.log('id', id);

    const query = `
      UPDATE supplier
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE rut_supplier = $1 AND is_deleted = FALSE
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Supplier;
