const employeeService = require('../services/employee.service');

const employeeController = {
  getEmployees: async (req, res) => {
    try {
      const employees = await employeeService.getEmployees();
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error getting employees:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  addEmployee: async (req, res) => {
    try {
      const { rut, name_user, email } = req.body;
      const newEmployee = await employeeService.addEmployee(
        rut,
        name_user,
        email
      );
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error('Error adding employee:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
};

module.exports = employeeController;
