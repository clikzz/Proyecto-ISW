const { sendWelcomeEmail } = require('./email.service');
const User = require('../models/User');

const employeeService = {
  getEmployees: async () => {
    return await User.getEmployees();
  },

  addEmployee: async (rut, name_user, email) => {
    const temporaryPassword = Math.random().toString(36).slice(-8);

    const newEmployee = await User.create(
      rut,
      name_user,
      email,
      temporaryPassword
    );

    sendWelcomeEmail(
      newEmployee.email,
      newEmployee.name_user,
      temporaryPassword
    );

    const { password_user, ...employeeWithoutPassword } = newEmployee;
    return employeeWithoutPassword;
  },

  deleteEmployee: async (rut) => {
    return await User.softDelete(rut);
  },

  updateEmployeeRole: async (rut, newRole) => {
    await User.updateRole(rut, newRole);
  },
};

module.exports = employeeService;
