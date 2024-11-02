const User = require('../models/User');
const bcrypt = require('bcrypt');

async function updateUserProfile(rut, updates) {
  const updatedUser = await User.findByRutAndUpdate(rut, updates);
  return updatedUser;
}

async function changeUserPassword(rut, currentPassword, newPassword) {
  // Encuentra al usuario por su RUT
  const user = await User.findByRut(rut);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verifica que la contraseña actual sea correcta
  const isValid = await bcrypt.compare(currentPassword, user.password_user);
  if (!isValid) {
    throw new Error('La contraseña actual es incorrecta');
  }

  // Encripta la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log("Contraseña encriptada guardada:", hashedPassword);

  // Actualiza la contraseña en la base de datos
  await User.updatePassword(rut, hashedPassword);

  return { success: true };
}

module.exports = {
  updateUserProfile,
  changeUserPassword,
};