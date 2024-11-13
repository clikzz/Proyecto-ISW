const express = require('express');
const multer = require('multer');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateProfileUpdateMiddleware, validatePasswordChangeMiddleware } = require('../middleware/profileValidation.middleware');

const router = express.Router();

// Configuración de multer para almacenar los archivos temporalmente en la carpeta 'uploads'
const storage = multer.memoryStorage();

const upload = multer({ storage });

router.put('/update', authMiddleware, validateProfileUpdateMiddleware, profileController.updateProfile);
router.put('/change-password', authMiddleware, validatePasswordChangeMiddleware, profileController.changePassword);
router.get('/getProfile', authMiddleware, profileController.getProfile);
router.post('/upload-profile-picture', authMiddleware, upload.single('file'), profileController.uploadProfilePicture);

module.exports = router;