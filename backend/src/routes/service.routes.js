const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.post('/create', serviceController.createService);
router.get('/all', serviceController.getServices);
router.get('/get/:id', serviceController.getServiceById);
router.put('/update/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);

module.exports = router;
