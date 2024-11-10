const User = require('../models/User');
const { sendWelcomeEmail } = require('./email.service');

const userService = {
  getUsers: async () => {
    return await User.getUsers();
  },

  addUser: async (rut, name_user, email) => {
    const temporaryPassword = Math.random().toString(36).slice(-8);

    const newUser = await User.create(rut, name_user, email, temporaryPassword);

    sendWelcomeEmail(newUser.email, newUser.name_user, temporaryPassword);

    const { password_user, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  deleteUser: async (rut) => {
    return await User.softDelete(rut);
  },

  updateUserRole: async (rut, newRole) => {
    await User.updateRole(rut, newRole);
  },
};

module.exports = userService;
