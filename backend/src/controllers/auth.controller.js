const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
      { expiresIn: '1h' }
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
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error en el login', error: error.message });
  }
};
