const db = require('../config/db');

class Service {
  static async create(data) {
    const query = `
      INSERT INTO service (name_service, description_service, price_service, date_service, user_rut)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.name_service, 
      data.description_service, 
      data.price_service, 
      data.date_service,
      data.user_rut];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT 
        s.id_service,
        s.name_service,
        s.description_service,
        s.price_service,
        s.date_service,
        s.user_rut,
        u.name_user AS employee_name,
        s.is_deleted
      FROM service s
      LEFT JOIN users u ON s.user_rut = u.rut
      WHERE s.is_deleted = FALSE;
    `;
    const result = await db.query(query);
    return result.rows;
  }
  

  static async findById(id) {
    const query = `
      SELECT 
        s.id_service,
        s.name_service,
        s.description_service,
        s.price_service,
        s.date_service,
        s.user_rut,
        u.name_user AS employee_name
      FROM service s
      LEFT JOIN users u ON s.user_rut = u.rut
      WHERE s.id_service = $1 AND s.is_deleted = FALSE;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE service
      SET name_service = $1, description_service = $2, price_service = $3, date_service = $4, user_rut = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id_service = $6 AND is_deleted = FALSE
      RETURNING *;
    `;
    const values = [data.name_service, data.description_service, data.price_service, data.date_service, data.user_rut, id];
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
