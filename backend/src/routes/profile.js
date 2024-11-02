const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateProfileUpdate, validatePasswordChange } = require('../validations/profile.validation');


router.put('/update', authMiddleware, validateProfileUpdate, profileController.updateProfile);
router.put('/change-password', authMiddleware, validatePasswordChange, profileController.changePassword);

module.exports = router;

