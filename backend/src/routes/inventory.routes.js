const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { validatePurchase, validateEditPurchase, validateSale, validateEditSale } = require('../middleware/inventory.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');

router.use(authMiddleware);

router.post(
  '/purchase',
  validatePurchase,
  authorizationMiddleware(['admin', 'employee']),
  inventoryController.createPurchase
);

router.get(
  '/purchases', 
  authorizationMiddleware(['admin', 'employee']),
  inventoryController.getPurchases
);

router.put(
  '/purchases/update/:id_transaction',
  validateEditPurchase,
  authorizationMiddleware(['admin', 'employee']),
  inventoryController.updatePurchase
)

router.delete(
  '/purchases/delete/:id', 
  authorizationMiddleware(['admin']),
  inventoryController.deletePurchase
);

router.post(
  '/sale',
  validateSale,
  authorizationMiddleware(['admin', 'employee']),
  inventoryController.createSale
);

router.get(
  '/sales', 
  authorizationMiddleware(['admin', 'employee']),
  inventoryController.getSales
);

router.put(
  '/sales/update/:id_transaction',
  validateEditSale,
  authorizationMiddleware(['admin', 'employee']),
  inventoryController.updateSale
);

router.delete(
  '/sales/delete/:id',
  authorizationMiddleware(['admin']),
  inventoryController.deleteSale
);

module.exports = router;
