const { Client } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  try {
    client.connect();
    // Crear tablas si no existen
    await client.query(`
      CREATE TABLE IF NOT EXISTS supplier (
        rut_supplier VARCHAR(50) PRIMARY KEY,
        name_supplier VARCHAR(255),
        email_supplier VARCHAR(255),
        phone_supplier VARCHAR(50),
        address_supplier TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        rut VARCHAR(50) PRIMARY KEY,
        name_user VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_user VARCHAR(255) NOT NULL,
        phone_user VARCHAR(50),
        role_user VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        status VARCHAR(10) DEFAULT 'enabled',
        profile_picture TEXT DEFAULT 'https://res.cloudinary.com/dfhtdd62s/image/upload/v1737841697/default_avatar_jhoeuk_wwx9cn.jpg'
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS service (
        id_service SERIAL PRIMARY KEY,
        name_service VARCHAR(255),
        description_service TEXT,
        price_service NUMERIC,
        date_service DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE,
        payment_method_service VARCHAR(255),
        rut_user VARCHAR(50) REFERENCES users(rut),
        status_service BOOLEAN DEFAULT TRUE,
        category VARCHAR(50)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transaction (
        id_transaction SERIAL PRIMARY KEY,
        transaction_type VARCHAR(50),
        amount NUMERIC,
        transaction_date DATE,
        payment_method VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE,
        rut VARCHAR(50) REFERENCES supplier(rut_supplier)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS item (
        id_item SERIAL PRIMARY KEY,
        name_item VARCHAR(255),
        description TEXT,
        category VARCHAR(50),
        stock INTEGER,
        selling_price NUMERIC,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transaction_item (
        id_transaction_item SERIAL PRIMARY KEY,
        id_item INTEGER REFERENCES item(id_item),
        quantity_item INTEGER,
        unit_price NUMERIC,
        subtotal NUMERIC,
        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW(),
        id_transaction INTEGER REFERENCES transaction(id_transaction),
        rut_supplier VARCHAR(50) REFERENCES supplier(rut_supplier)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transaction_service (
        id_transaction_service SERIAL PRIMARY KEY,
        date_transaction DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE,
        id_service INTEGER REFERENCES service(id_service)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS item_supplier (
        id_item_supplier SERIAL PRIMARY KEY,
        id_item INTEGER REFERENCES item(id_item),
        rut_supplier VARCHAR(50) REFERENCES supplier(rut_supplier),
        purchase_price NUMERIC,
        purchase_date DATE,
        is_deleted BOOLEAN DEFAULT FALSE
      );
    `);

    // Crear usuario administrador
    const adminEmail = 'bikefy@yopmail.com';
    const adminPassword = 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const rut = '12.345.678-9';

    const adminExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );

    if (adminExists.rows.length === 0) {
      await client.query(
        `INSERT INTO users (rut, name_user, email, password_user, role_user, created_at, status) VALUES ($1, $2, $3, $4, $5, NOW(), 'enabled')`,
        [rut, 'Admin', adminEmail, hashedPassword, 'admin']
      );
      console.log('Usuario administrador creado con éxito.');
    } else {
      console.log('El usuario administrador ya existe.');
    }

    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

initializeDatabase();

module.exports = client;
