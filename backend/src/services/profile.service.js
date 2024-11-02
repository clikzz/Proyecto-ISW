const User = require('../models/User');
const bcrypt = require('bcrypt');

async function updateUserProfile(rut, updates) {
  const updatedUser = await User.findByRutAndUpdate(rut, updates);
  return updatedUser;
}

async function changeUserPassword(rut, currentPassword, newPassword) {
  const user = await User.findByRut(rut);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password_user);
  if (!isValid) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10); // Solo hashear una vez
  console.log("Contraseña encriptada guardada:", hashedPassword);

  await User.updatePassword(rut, hashedPassword); // Guardar el hash directamente

  return { success: true };
}

module.exports = {
  updateUserProfile,
  changeUserPassword,
};