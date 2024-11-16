userService = require("../services/user.service");
const User = require("../models/User");

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  addUser: async (req, res) => {
    try {
      const { rut, name_user, email } = req.body;

      const existingEmail = await User.findByEmail(email);
      const existingRut = await User.findByRut(rut);

      if (existingRut) {
        if (existingRut.status === "enabled") {
          return res.status(400).json({ message: "User already exists" });
        } else {
          if (existingEmail) {
            if (existingEmail.rut === rut) {
              await userService.softAddUser(rut, name_user, email);
              return res
                .status(201)
                .json({ message: "User added successfully" });
            } else {
              return res.status(400).json({ message: "Email already in use" });
            }
          } else {
            await userService.softAddUser(rut, name_user, email);
            return res.status(201).json({ message: "User added successfully" });
          }
        }
      }

      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await userService.addUser(rut, name_user, email);
      res.status(201).json({
        message: "User added successfully",
        user,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      console.log(error.message);

      res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { rut } = req.params;
      await userService.deleteUser(rut);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const { rut } = req.params;
      const { role } = req.body;
      await userService.updateUserRole(rut, role);
      res.status(200).json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

module.exports = userController;
