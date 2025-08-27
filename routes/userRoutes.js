const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin, isSuperAdmin } = require('../middleware/auth');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Current user route
router.get('/me', authenticate, userController.getCurrentUser);

// Admin only routes
router.get('/', [authenticate, isAdmin], userController.getAllUsers);
router.get('/students', [authenticate, isAdmin], userController.getAllStudents);

// User management routes
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', [authenticate, isSuperAdmin], userController.deleteUser);

module.exports = router; 