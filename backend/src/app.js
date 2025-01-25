const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const transactionRoutes = require('./routes/transaction.routes');
const itemRoutes = require('./routes/item.routes');
const serviceRoutes = require('./routes/service.routes');
const transactionServiceRoutes = require('./routes/transactionService.routes');
const supplierRoutes = require('./routes/supplier.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const userRoutes = require('./routes/user.routes');
const itemSupplierRoutes = require('./routes/itemSupplier.routes');
const taskRoutes = require('./routes/task.routes');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://bikefy.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/transactions', transactionServiceRoutes);
app.use('/api/itemsupp', itemSupplierRoutes);
app.use('/api/task', taskRoutes);

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 80;

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
