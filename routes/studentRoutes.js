const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

// These routes are for managing students, essentially a subset of user management
// but focused specifically on student accounts

// Get all students
router.get('/', [authenticate, isAdmin], userController.getAllStudents);

// Adding other student-specific routes if needed
// Note: Most user management is handled by userRoutes.js

module.exports = router; 