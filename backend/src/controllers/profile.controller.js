const User = require('../models/User');
const bcrypt = require('bcrypt');

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  const { name_user, phone_user } = req.body;
  const rut = req.user.rut;

  try {
    const updatedUser = await User.updateProfile(rut, { name_user, phone_user });
    res.status(200).json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil', error });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const rut = req.user.rut;

  try {
    const user = await User.findByRut(rut);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(currentPassword, user.password_user);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas nuevas no coinciden' });

    await User.updatePassword(rut, newPassword);
    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar la contraseña', error });
  }
};
