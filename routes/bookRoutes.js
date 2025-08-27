const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.getBookById);

// Seed route (for development/testing)
router.post('/seed', bookController.seedBooks);

// Admin only routes
router.post('/', [authenticate, isAdmin], bookController.addBook);
router.put('/:id', [authenticate, isAdmin], bookController.updateBook);
router.delete('/:id', [authenticate, isAdmin], bookController.deleteBook);

module.exports = router; 