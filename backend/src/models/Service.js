const db = require('../config/db');

class Service {
  static async create(data) {
    const query = `
      INSERT INTO service (name_service, description_service, price_service, date_service)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [data.name_service, data.description_service, data.price_service, data.date_service];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM service WHERE is_deleted = FALSE';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM service WHERE id_service = $1 AND is_deleted = FALSE';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE service
      SET name_service = $1, description_service = $2, price_service = $3, date_service = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id_service = $5 AND is_deleted = FALSE
      RETURNING *;
    `;
    const values = [data.name_service, data.description_service, data.price_service, data.date_service, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      UPDATE service
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id_service = $1
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Service;
