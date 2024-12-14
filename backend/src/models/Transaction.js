const pool = require('../config/db');

class Transaction {
  static async getAll() {
    const query = `
      SELECT t.*, u.name_user, u.status as user_status
      FROM transaction t
      LEFT JOIN users u ON t.rut = u.rut
      WHERE t.is_deleted = FALSE
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

  static async getById(id_transaction) {
    const query = 'SELECT * FROM transaction WHERE id_transaction = $1 AND is_deleted = FALSE';
    const result = await pool.query(query, [id_transaction]);
    return result.rows[0];
  }

  static async update(id_transaction, transactionData) {
    const { transaction_type, amount, payment_method, description } = transactionData;
    const query = `
      UPDATE transaction
      SET transaction_type = $1, amount = $2, payment_method = $3, description = $4
      WHERE id_transaction = $5 AND is_deleted = FALSE
      RETURNING *
    `;
    const values = [transaction_type, amount, payment_method, description, id_transaction];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id_transaction) {
    const query = `
      UPDATE transaction
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id_transaction = $1 AND is_deleted = FALSE
      RETURNING *
    `;
    const result = await pool.query(query, [id_transaction]);
    return result.rows[0];
  }

  static async getSummary() {
    const query = `
      SELECT
        SUM(CASE WHEN transaction_type = 'ingreso' THEN amount ELSE 0 END) AS ingresos,
        SUM(CASE WHEN transaction_type = 'egreso' THEN amount ELSE 0 END) AS egresos,
        SUM(CASE WHEN transaction_type = 'ingreso' THEN amount ELSE 0 END) - SUM(CASE WHEN transaction_type = 'egreso' THEN amount ELSE 0 END) AS balance
      FROM transaction
      WHERE is_deleted = FALSE
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Transaction;
