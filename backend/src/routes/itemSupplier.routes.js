const express = require('express');
const router = express.Router();
const itemSupplierController = require('../controllers/itemSupplier.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin', 'employee']));

// Agregar un proveedor a un ítem
router.post('/supplier/item', itemSupplierController.addSupplierToItem);

// Obtener todos los proveedores de un ítem
router.get('/supplier/:id_item', itemSupplierController.getSuppliersByItem);

// Obtener todos los ítems de un proveedor
router.get('/item/:rut_supplier', itemSupplierController.getItemsBySupplier);

module.exports = router;