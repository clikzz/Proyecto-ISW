const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { validateInventory } = require('../middleware/inventory.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');

router.use(authMiddleware);

router.use(authorizationMiddleware(['admin', 'employee']));

router.post('/create', validateInventory, inventoryController.createTransaction);
router.get('/purchases', inventoryController.getPurchases);
router.get('/sales', inventoryController.getSales);

module.exports = router;
