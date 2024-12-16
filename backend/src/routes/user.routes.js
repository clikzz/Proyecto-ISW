const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const { validateUser } = require('../middleware/user.middleware');

router.use(authMiddleware);

router.get(
  '/getUsers',
  authorizationMiddleware(['admin', 'employee']),
  userController.getUsers
);
router.post(
  '/addUser',
  authorizationMiddleware(['admin']),
  validateUser,
  userController.addUser
);
router.delete(
  '/deleteUser/:rut',
  authorizationMiddleware(['admin']),
  userController.deleteUser
);
router.put(
  '/updateUserRole/:rut',
  authorizationMiddleware(['admin']),
  userController.updateUserRole
);

module.exports = router;
