const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const nextAuth = require('./config/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/nextauth', (req, res) => nextAuth(req, res));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
