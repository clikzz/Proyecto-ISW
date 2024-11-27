const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { validateCreateItem, validateUpdateItem } = require('../middleware/item.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post(
    '/create',
    authorizationMiddleware(['admin', 'employee']),
    validateCreateItem, 
    itemController.createItem
);

router.get(
    '/all',
    authorizationMiddleware(['admin', 'employee']),
    itemController.getItems
);

router.get(
    '/get/:id',
    authorizationMiddleware(['admin', 'employee']),
    itemController.getItemById
);

router.put(
    '/update/:id',
    authorizationMiddleware(['admin', 'employee']),
    validateUpdateItem,
    itemController.updateItem
);

router.delete(
    '/delete/:id',
    authorizationMiddleware(['admin']),
    itemController.deleteItem
);

module.exports = router;