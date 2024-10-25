const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    static async create(rut, name_user, email, password_user, role_user = 'user') {
        const hashedPassword = await bcrypt.hash(password_user, 10);
        const query = 'INSERT INTO "user" (rut, name_user, email, password_user, role_user) VALUES($1, $2, $3, $4, $5) RETURNING rut, name_user, email, role_user, created_at';
        const values = [rut, name_user, email, hashedPassword, role_user];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM "user" WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async validatePassword(user, password) {
        return bcrypt.compare(password, user.password_user);
    }
}

module.exports = User;