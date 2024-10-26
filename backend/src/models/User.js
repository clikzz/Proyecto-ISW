const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(rut, name_user, email, password_user, role_user = 'user') {
    const hashedPassword = await bcrypt.hash(password_user, 10);
    const query = `
      INSERT INTO "users" (rut, name_user, email, password_user, role_user)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING rut, name_user, email, role_user, created_at;
    `;
    const values = [rut, name_user, email, hashedPassword, role_user];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM "users" WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_user);
  }

  static async findByRut(rut) {
    const query = 'SELECT * FROM "users" WHERE rut = $1';
    const result = await db.query(query, [rut]);
    return result.rows[0];
  }

  static async findByResetToken(resetToken) {
    const query = 'SELECT * FROM "users" WHERE reset_token = $1';
    const result = await db.query(query, [resetToken]);
    return result.rows[0];
  }

  static async updatePassword(rut, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE "users" SET password_user = $1 WHERE rut = $2';
    await db.query(query, [hashedPassword, rut]);
  }

  static async setResetToken(rut, resetToken, resetTokenExpiry) {
    const query = 'UPDATE "users" SET reset_token = $1, reset_token_expiry = $2 WHERE rut = $3';
    await db.query(query, [resetToken, resetTokenExpiry, rut]);
  }

  static async clearResetToken(rut) {
    const query = 'UPDATE "users" SET reset_token = NULL, reset_token_expiry = NULL WHERE rut = $1';
    await db.query(query, [rut]);
  }
}

module.exports = User;
