const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

app.listen(PORT, HOST, async () => {
  console.log('\x1b[32m%s\x1b[0m', '=> API Iniciada exitosamente');

  try {
    await pool.query('SELECT NOW()');
    console.log('\x1b[32m%s\x1b[0m', '=> Conexión exitosa a la base de datos!');
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      '=> Error en la conexión a la base de datos:',
      error.message
    );
    process.exit(1);
  }

  console.log(
    '\x1b[36m%s\x1b[0m',
    `=> Servidor corriendo en http://${HOST}:${PORT}/api`
  );
});

module.exports = app;
