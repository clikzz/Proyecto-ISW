const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const {
  validateCreateSupplier,
  validateUpdateSupplier,
} = require('../middleware/supplier.middleware');

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
