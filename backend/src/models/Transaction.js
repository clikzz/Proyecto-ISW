//models/Transaction.js
const pool = require('../config/db');

class Transaction {
  static async getAll() {
    const query = `
      SELECT t.*, u.name_user, u.status as user_status
      FROM transaction t
      LEFT JOIN users u ON t.rut = u.rut
      ORDER BY t.transaction_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async create(transactionData) {
    const { rut, transaction_type, amount, payment_method, description } = transactionData;
    const query = `
      INSERT INTO transaction (rut, transaction_type, amount, payment_method, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [rut, transaction_type, amount, payment_method, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getSummary() {
    const query = `
      SELECT
        SUM(CASE WHEN transaction_type = 'ingreso' THEN amount ELSE 0 END) AS ingresos,
        SUM(CASE WHEN transaction_type = 'egreso' THEN amount ELSE 0 END) AS egresos,
        SUM(CASE WHEN transaction_type = 'ingreso' THEN amount ELSE 0 END) - SUM(CASE WHEN transaction_type = 'egreso' THEN amount ELSE 0 END) AS balance
      FROM transaction
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Transaction;
