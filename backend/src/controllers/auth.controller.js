const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../services/email.service');
const loginSchema = require('../validations/login.validation');
const registerSchema = require('../validations/register.validation');

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { rut, name_user, email, password_user } = value;

    // Verificar si el usuario ya existe
    const existingEmail = await User.findByEmail(email);
    const existingRut = await User.findByRut(rut);
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya está en uso' });
    }
    if (existingRut) {
      return res.status(400).json({ message: 'El rut ya está en uso' });
    }

    const user = await User.create(rut, name_user, email, password_user);

    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token,
      role: user.role_user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al registrar usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { rut, password } = value;

    const user = await User.findByRut(rut);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isValid = await bcrypt.compare(password, user.password_user);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const status = await User.validateStatus(user.rut);
    if (status !== 'enabled') {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    const token = generateToken(user);

    res.json({ message: 'Login exitoso', token, role: user.role_user });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error en el login', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: 'El correo electrónico es obligatorio' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'No existe un usuario con este correo electrónico' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString();

    await User.setResetToken(user.rut, resetToken, resetTokenExpiry);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({
      message:
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      message:
        'Error al procesar la solicitud de restablecimiento de contraseña',
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token y nueva contraseña son obligatorios' });
    }

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const now = new Date();
    const tokenExpiry = new Date(user.reset_token_expiry);

    if (now > tokenExpiry) {
      return res.status(400).json({ message: 'El token ha expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updatePassword(user.rut, hashedPassword);
    await User.clearResetToken(user.rut);

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      message: 'Error al restablecer la contraseña',
      error: error.message,
    });
  }
};

exports.validateToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ isValid: false, role: null });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isValid: false, role: null });
    }

    const role = decoded.role;

    res.status(200).json({ isValid: true, role });
  });
};

function generateToken(user) {
  return jwt.sign(
    { rut: user.rut, role: user.role_user },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
}
