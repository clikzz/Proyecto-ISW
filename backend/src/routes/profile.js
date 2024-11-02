const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateProfileUpdateMiddleware, validatePasswordChangeMiddleware } = require('../middleware/profileValidation.middleware');


router.put('/update', authMiddleware, validateProfileUpdateMiddleware, profileController.updateProfile);
router.put('/change-password', authMiddleware, validatePasswordChangeMiddleware, profileController.changePassword);
router.get('/getProfile', authMiddleware, profileController.getProfile);

module.exports = router;