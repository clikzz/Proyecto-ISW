const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const serviceController = require('../controllers/service.controller');
const { validateCreateService, validateUpdateService } = require('../middleware/service.middleware');


router.use(authMiddleware);


router.post(
    '/create',
    authorizationMiddleware(['admin', 'employee']),
    validateCreateService, 
    serviceController.createService
);


router.get(
    '/all',
    authorizationMiddleware(['admin', 'employee']),
    serviceController.getServices
);


router.get(
    '/get/:id',
    authorizationMiddleware(['admin', 'employee']),
    serviceController.getServiceById
);

router.put(
    '/update/:id',
    authorizationMiddleware(['admin', 'employee']),
    validateUpdateService, 
    serviceController.updateService
);


router.delete(
    '/delete/:id',
    authorizationMiddleware(['admin']),
    serviceController.deleteService
);

module.exports = router;
