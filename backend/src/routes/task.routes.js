const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizationMiddleware = require('../middleware/authorization.middleware');
const taskController = require('../controllers/task.controller');

router.use(authMiddleware);
router.use(authorizationMiddleware(['admin', 'employee']));

router.get('/all', taskController.getTasks);
router.put('/:id', taskController.assignTask);
router.put('/:id/status', taskController.updateTaskStatus);

module.exports = router;
