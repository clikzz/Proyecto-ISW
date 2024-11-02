const User = require('../models/User');
const { updateUserProfile, changeUserPassword } = require('../services/profile.service');
const bcrypt = require('bcrypt');

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    const { name_user, phone_user } = req.body;
    const rut = req.user.rut; // El rut del usuario autenticado

    // Construir el objeto de actualización solo con los campos proporcionados
    const updates = {};
    if (name_user) updates.name_user = name_user;
    if (phone_user) updates.phone_user = phone_user;

    // Verificar que al menos un campo esté presente
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    // Llamar al servicio para actualizar el perfil del usuario
    const updatedUser = await updateUserProfile(rut, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const rut = req.user.rut; // El rut del usuario autenticado
    const { currentPassword, newPassword } = req.body;

    // Validación: Verificar que las contraseñas estén presentes
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'La contraseña actual y la nueva contraseña son obligatorias' });
    }

    // Llamar al servicio para cambiar la contraseña del usuario
    await changeUserPassword(rut, currentPassword, newPassword);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    if (error.message === 'Usuario no encontrado' || error.message === 'La contraseña actual es incorrecta') {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const rut = req.user.rut; // Aquí asumo que 'rut' se obtiene del token JWT
    const user = await User.findByRut(rut);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Envía solo los datos necesarios del usuario, sin la contraseña
    const { name_user, phone_user, created_at } = user; // Desestructuramos sin 'rut' ya que lo tenemos en 'req.user'
    res.json({ name_user, phone_user, rut, created_at });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};
