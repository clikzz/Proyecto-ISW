const { sendWelcomeEmail } = require('./email.service');
const User = require('../models/User');

const employeeService = {
  getEmployees: async () => {
    return await User.getEmployees();
  },

  addEmployee: async (rut, name_user, email) => {
    // Generar una contraseña temporal
    const temporaryPassword = Math.random().toString(36).slice(-8);

    const newEmployee = await User.create(
      rut,
      name_user,
      email,
      temporaryPassword
    );

    // Aquí podrías agregar lógica para enviar un email al nuevo empleado con su contraseña temporal
    sendWelcomeEmail(
      newEmployee.email,
      newEmployee.name_user,
      temporaryPassword
    );

    // Retornar el nuevo empleado sin la contraseña
    const { password_user, ...employeeWithoutPassword } = newEmployee;
    return employeeWithoutPassword;
  },

  deleteEmployee: async (rut) => {
    await User.delete(rut);
  },

  updateEmployeeRole: async (rut, newRole) => {
    await User.updateRole(rut, newRole);
  },
};

module.exports = employeeService;
