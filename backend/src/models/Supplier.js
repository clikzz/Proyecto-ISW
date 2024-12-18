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

  static async softCreate(data) {
    console.log('softCreate', data);

    const query = `
      UPDATE supplier
      SET name_supplier = $2, email_supplier = $3, phone_supplier = $4, address_supplier = $5, is_deleted = $6, updated_at = CURRENT_TIMESTAMP
      WHERE rut_supplier = $1
      RETURNING *;
    `;
    const values = [
      data.rut_supplier,
      data.name_supplier,
      data.email_supplier,
      data.phone_supplier,
      data.address_supplier,
      false,
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
    console.log(id);
    const result = await db.query(
      'SELECT * FROM supplier WHERE rut_supplier = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(rut, data) {
    const checkQuery =
      'SELECT * FROM supplier WHERE rut_supplier = $1 AND is_deleted = FALSE';
    const checkResult = await db.query(checkQuery, [rut]);
    if (checkResult.rows.length === 0) {
      throw new Error('Supplier not found');
    }

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
      rut,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      UPDATE supplier
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE rut_supplier = $1 AND is_deleted = FALSE
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findItems(rut) {
    const query = `
      SELECT DISTINCT
        i.*
      FROM
        item_supplier item_supp
      JOIN
        item i ON item_supp.id_item = i.id_item
      WHERE
        item_supp.rut_supplier = $1 AND item_supp.is_deleted = FALSE
    `;
    const result = await db.query(query, [rut]);
    return result.rows;
  }
}

module.exports = Supplier;
