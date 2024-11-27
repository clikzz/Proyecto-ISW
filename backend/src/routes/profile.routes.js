const express = require('express');
const multer = require('multer');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const {
  validateProfileUpdateMiddleware,
  validatePasswordChangeMiddleware,
} = require('../middleware/profileValidation.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin', 'employee']));

// Configuración de multer para almacenar los archivos temporalmente en la carpeta 'uploads'
const storage = multer.memoryStorage();

const upload = multer({ storage });

router.put(
  '/update',
  validateProfileUpdateMiddleware,
  profileController.updateProfile
);
router.put(
  '/change-password',
  validatePasswordChangeMiddleware,
  profileController.changePassword
);
router.get('/getProfile', profileController.getProfile);
router.post(
  '/upload-profile-picture',
  upload.single('file'),
  profileController.uploadProfilePicture
);

module.exports = router;
