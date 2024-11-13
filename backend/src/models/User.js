const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async create(
    rut,
    name_user,
    email,
    password_user,
    role_user = "employee"
  ) {
    const hashedPassword = await bcrypt.hash(password_user, 10);
    const query = `
      INSERT INTO "users" (rut, name_user, email, password_user, role_user, status)
      VALUES ($1, $2, $3, $4, $5, 'enabled')
      RETURNING rut, name_user, email, role_user, created_at, status;
    `;
    const values = [rut, name_user, email, hashedPassword, role_user];
    const result = await db.query(query, values);
    console.log(result.rows[0]);

    return result.rows[0];
  }

  static async softCreate(
    rut,
    name_user,
    email,
    password_user,
    role_user = "employee"
  ) {
    const hashedPassword = await bcrypt.hash(password_user, 10);
    const query = `
    UPDATE "users"
    SET name_user = $2, email = $3, password_user = $4, role_user = $5, status = 'enabled'
    WHERE rut = $1
    RETURNING rut, name_user, email, role_user, created_at, status;
    `;
    const values = [rut, name_user, email, hashedPassword, role_user];
    const result = await db.query(query, values);
    console.log(result.rows[0]);

    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM "users" WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findByRut(rut) {
    const query = 'SELECT * FROM "users" WHERE rut = $1';
    const result = await db.query(query, [rut]);
    return result.rows[0];
  }

  static async findByRutAndUpdate(rut, updates) {
    let query = 'UPDATE "users" SET ';
    const values = [];
    let count = 1;

    for (const [key, value] of Object.entries(updates)) {
      query += `${key} = $${count}, `;
      values.push(value);
      count++;
    }

    query =
      query.slice(0, -2) +
      `, updated_at = NOW() AT TIME ZONE 'America/Santiago' WHERE rut = $${count} RETURNING rut, name_user, phone_user, email, role_user, created_at, updated_at, status`;
    values.push(rut);

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_user);
  }

  static async validateStatus(rut) {
    const query = 'SELECT status FROM "users" WHERE rut = $1';
    const result = await db.query(query, [rut]);
    return result.rows[0].status;
  }

  static async getUsers() {
    const query = `
      SELECT
        profile_picture,
        rut,
        name_user,
        phone_user,
        email,
        role_user,
        created_at,
        status
      FROM "users"
      WHERE (role_user = $1 OR role_user = $2)
        AND status = 'enabled'
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, ["employee", "admin"]);
    return result.rows;
  }

  static async softDelete(rut) {
    const query = `
      UPDATE "users"
      SET status = 'disabled'
      WHERE rut = $1
      RETURNING rut, name_user, email, role_user
    `;
    const result = await db.query(query, [rut]);
    return result.rows[0];
  }

  static async updateRole(rut, newRole) {
    const query = `
      UPDATE "users"
      SET role_user = $1
      WHERE rut = $2
      RETURNING rut, name_user, email, role_user
    `;
    const result = await db.query(query, [newRole, rut]);
    return result.rows[0];
  }

  static async updateStatusAndPassword(rut, status, password) {
    const query = `
      UPDATE "users"
      SET status = $1, password_user = $2
      WHERE rut = $3
      RETURNING rut, name_user, email, role_user
    `;
    const result = await db.query(query, [status, password, rut]);
    return result.rows[0];
  }
}

module.exports = User;
