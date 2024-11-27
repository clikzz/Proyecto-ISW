const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employees.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const { validateEmployee } = require('../middleware/employees.middleware');

// Aplicar el middleware de autenticación a todas las rutas de empleados
router.use(authMiddleware);

// Aplicar el middleware de autorización a todas las rutas de empleados
router.use(authorizationMiddleware(['admin']));

// Ruta para obtener todos los empleados
router.get('/getEmployees', employeeController.getEmployees);

// Ruta para agregar un nuevo empleado
router.post('/addEmployee', validateEmployee, employeeController.addEmployee);

// Ruta para eliminar un empleado
router.delete('/deleteEmployee/:rut', employeeController.deleteEmployee);

// Ruta para actualizar el rol de un empleado
router.put('/updateEmployeeRole/:rut', employeeController.updateEmployeeRole);

module.exports = router;
