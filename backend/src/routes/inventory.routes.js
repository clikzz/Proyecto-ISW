const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { validatePurchase, validateSale, validateEditSale } = require('../middleware/inventory.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');

router.use(authMiddleware);

router.use(authorizationMiddleware(['admin', 'employee']));

router.post('/purchase', validatePurchase, inventoryController.createPurchase);
router.post('/sale', validateSale, inventoryController.createSale);

router.put(
  '/sales/update/:id_transaction',
  authorizationMiddleware(['admin', 'employee']),
  validateEditSale,
  inventoryController.updateSale
);

router.get('/purchases', inventoryController.getPurchases);
router.get('/sales', inventoryController.getSales);

module.exports = router;
