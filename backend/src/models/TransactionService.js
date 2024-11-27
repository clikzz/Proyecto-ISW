
const db = require('../config/db');

class TransactionService {
  static async create(data) {
    const query = `
      INSERT INTO transaction_service (id_service, date_transaction)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [data.id_service, data.date_transaction];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT ts.*, s.name_service
      FROM transaction_service ts
      JOIN service s ON ts.id_service = s.id_service
      WHERE ts.is_deleted = FALSE;
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = TransactionService;
