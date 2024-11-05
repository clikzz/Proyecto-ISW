const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { validateInventory } = require('../middleware/inventory.middleware');

router.post('/create', validateInventory, inventoryController.createTransaction);

module.exports = router;
