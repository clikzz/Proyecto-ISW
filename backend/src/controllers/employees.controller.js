const employeeService = require("../services/employee.service");
const User = require("../models/User");

const employeeController = {
  getEmployees: async (req, res) => {
    try {
      const employees = await employeeService.getEmployees();
      res.status(200).json(employees);
    } catch (error) {
      console.error("Error getting employees:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  addEmployee: async (req, res) => {
    try {
      const { rut, name_user, email } = req.body;

      const existingEmail = await User.findByEmail(email);
      const existingRut = await User.findByRut(rut);
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "El correo electrónico ya está en uso" });
      }
      if (existingRut) {
        return res.status(400).json({ message: "El rut ya está en uso" });
      }

      const employee = await employeeService.addEmployee(rut, name_user, email);

      res.status(201).json({
        message: "Employee added successfully",
        employee,
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      console.log(error.message);

      res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { rut } = req.params;
      await employeeService.deleteEmployee(rut);
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  updateEmployeeRole: async (req, res) => {
    console.log("updateEmployeeRole");

    try {
      const { rut } = req.params;
      const { newRole } = req.body;
      console.log("rut:", rut);
      console.log("newRole:", newRole);

      const employee = await employeeService.updateEmployeeRole(rut, newRole);
      res.status(200).json({
        message: "Employee updated successfully",
        employee,
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

module.exports = employeeController;
