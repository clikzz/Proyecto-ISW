const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { validateCreateItem, validateUpdateItem } = require('../middleware/item.middleware');

router.post('/create', validateCreateItem, itemController.createItem);
router.get('/all', itemController.getItems);
router.get('/get/:id', itemController.getItemById);
router.put('/update/:id', validateUpdateItem, itemController.updateItem);
router.delete('/delete/:id', itemController.deleteItem);

module.exports = router;
