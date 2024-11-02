const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employees.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Aplicar el middleware de autenticación a todas las rutas de empleados
router.use(authMiddleware);

// Ruta para obtener todos los empleados
router.get('/getEmployees', employeeController.getEmployees);

// Ruta para agregar un nuevo empleado
router.post('/addEmployee', employeeController.addEmployee);

// Ruta para eliminar un empleado
router.delete('/deleteEmployee/:rut', employeeController.deleteEmployee);

module.exports = router;
