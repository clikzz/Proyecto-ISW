const pool = require('../config/db');

class Transaction {
  static async getAll() {
    const query = `
      SELECT t.*, u.name_user, u.status as user_status
      FROM transaccion t
      LEFT JOIN users u ON t.rut = u.rut
      ORDER BY t.fecha DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async create(transactionData) {
    const { rut, tipo, monto, metodo_pago, descripcion } = transactionData;
    const query = `
      INSERT INTO transaccion (rut, tipo, monto, metodo_pago, descripcion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [rut, tipo, monto, metodo_pago, descripcion];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getSummary() {
    const query = `
      SELECT
        SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS ingresos,
        SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS egresos,
        SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) -
        SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS balance
      FROM transaccion
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Transaction;
