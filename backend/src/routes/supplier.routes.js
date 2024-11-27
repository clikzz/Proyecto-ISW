const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const supplierController = require('../controllers/supplier.controller');
const {
  validateCreateSupplier,
  validateUpdateSupplier,
} = require('../middleware/supplier.middleware');

// Aplicar el middleware de autenticación a todas las rutas de proveedores
router.use(authMiddleware);

// Aplicar el middleware de autorización a todas las rutas de proveedores
router.use(authorizationMiddleware(['admin', 'employee']));

router.post(
  '/create',
  validateCreateSupplier,
  supplierController.createSupplier
);
router.get('/all', supplierController.getSuppliers);
router.get('/get/:rut', supplierController.getSupplierById);
router.put(
  '/update/:rut',
  validateUpdateSupplier,
  supplierController.updateSupplier
);
router.delete('/delete/:rut', supplierController.deleteSupplier);

module.exports = router;
