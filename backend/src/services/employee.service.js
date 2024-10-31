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
      temporaryPassword,
      'employee'
    );

    // Aquí podrías agregar lógica para enviar un email al nuevo empleado con su contraseña temporal

    // Retornar el nuevo empleado sin la contraseña
    const { password_user, ...employeeWithoutPassword } = newEmployee;
    return employeeWithoutPassword;
  },
};

module.exports = employeeService;
