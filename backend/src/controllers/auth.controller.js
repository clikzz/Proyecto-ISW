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
    pass: process.env.EMAIL_PASS
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

    res
      .status(201)
      .json({ message: 'Usuario registrado exitosamente', user, token });
    console.log('se crea');
  } catch (error) {
    console.log('error2');

    res
      .status(500)
      .json({ message: 'Error al registrar usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findByEmail(email);
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

    res.json({ message: 'Login exitoso', token });
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
      return res.status(400).json({ message: 'El correo electrónico es obligatorio' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No existe un usuario con este correo electrónico' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    await User.setResetToken(user.rut, resetToken, resetTokenExpiry);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;


    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Restablecimiento de contraseña',
      text: `Has recibido este correo porque tú (o alguien más) ha solicitado el restablecimiento de la contraseña de tu cuenta.\n\n
      Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:\n\n
      ${resetUrl}\n\n
      Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud de restablecimiento de contraseña' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios' });
    }

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    if (Date.now() > user.reset_token_expiry) {
      return res.status(400).json({ message: 'El token ha expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.rut, hashedPassword);
    await User.clearResetToken(user.rut);

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};
