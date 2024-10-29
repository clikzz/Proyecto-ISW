const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

//transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verificar la conexión
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

exports.register = async (req, res) => {
  try {
    const { rut, name_user, email, password_user } = req.body;

    console.log(req.body);

    if (!rut || !name_user || !email || !password_user) {
      console.log('error1');

      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' });
    }

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

    const token = jwt.sign(
      { id: user.rut, role: user.role_user },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

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
    const { rut, password } = req.body;

    if (!rut || !password) {
      return res
        .status(400)
        .json({ message: 'RUT y contraseña son obligatorios' });
    }

    const user = await User.findByRut(rut);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isValid = await bcrypt.compare(password, user.password_user);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.rut, role: user.role_user },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    console.log(user.role_user);

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

    console.log('Buscando usuario con email:', email);
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('Usuario no encontrado');
      return res
        .status(404)
        .json({ message: 'No existe un usuario con este correo electrónico' });
    }
    console.log('Usuario encontrado:', user);

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString();

    console.log('Configurando token de restablecimiento');
    await User.setResetToken(user.rut, resetToken, resetTokenExpiry);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log('URL de restablecimiento:', resetUrl);

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Restablecimiento de contraseña',
      text: `Has recibido este correo porque tú (o alguien más) ha solicitado el restablecimiento de la contraseña de tu cuenta.\n\n
      Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:\n\n
      ${resetUrl}\n\n
      Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`,
    };

    console.log('Enviando correo');
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado');

    res.status(200).json({
      message:
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        message: 'Error de autenticación al enviar el correo',
        error: error.message,
      });
    }
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

    console.log('Buscando usuario con token:', token);
    const user = await User.findByResetToken(token);
    if (!user) {
      console.log('Usuario no encontrado con el token proporcionado');
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
    console.log('Usuario encontrado:', user);

    const now = new Date();
    const tokenExpiry = new Date(user.reset_token_expiry);
    console.log(
      'Fecha actual:',
      now,
      'Fecha de expiración del token:',
      tokenExpiry
    );

    if (now > tokenExpiry) {
      console.log('El token ha expirado');
      return res.status(400).json({ message: 'El token ha expirado' });
    }

    console.log('Hasheando nueva contraseña');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Actualizando contraseña para el usuario');
    await User.updatePassword(user.rut, hashedPassword);

    console.log('Limpiando token de restablecimiento');
    await User.clearResetToken(user.rut);

    console.log('Contraseña actualizada exitosamente');
    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      message: 'Error al restablecer la contraseña',
      error: error.message,
    });
  }
};
