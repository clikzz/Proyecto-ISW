const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const supplierController = require('../controllers/supplier.controller');
const {
  validateCreateSupplier,
  validateUpdateSupplier,
} = require('../middleware/supplier.middleware');

router.use(authMiddleware);

router.post(
  '/create',
  authorizationMiddleware(['admin']),
  validateCreateSupplier,
  supplierController.createSupplier
);

router.get(
  '/all',
  authorizationMiddleware(['admin', 'employee']),
  supplierController.getSuppliers
);

router.get(
  '/get/:rut',
  authorizationMiddleware(['admin']),
  supplierController.getSupplierById
);

router.put(
  '/update/:rut',
  authorizationMiddleware(['admin']),
  validateUpdateSupplier,
  supplierController.updateSupplier
);
router.delete(
  '/delete/:rut',
  authorizationMiddleware(['admin']),
  supplierController.deleteSupplier
);

router.get(
  '/items/:rut',
  authorizationMiddleware(['admin']),
  supplierController.getSupplierItems
);

module.exports = router;
