const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const serviceController = require('../controllers/service.controller');

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin', 'employee']));

router.post('/create', serviceController.createService);
router.get('/all', serviceController.getServices);
router.get('/get/:id', serviceController.getServiceById);
router.put('/update/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);

module.exports = router;
