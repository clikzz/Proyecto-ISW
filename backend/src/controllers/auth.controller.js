const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { rut, name_user, email, password_user, role_user } = req.body;

    if (!rut || !name_user || !email || !password_user) {
      return res.status(400).json({ message: 'RUT, name, email, and password are required' });
    }

    const user = await User.create(rut, name_user, email, password_user, role_user);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  res.status(200).json({ message: 'Use NextAuth for login' });
};
