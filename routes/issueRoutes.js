const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Admin only routes
router.post('/', [authenticate, isAdmin], issueController.issueBook);
router.put('/:issueId/return', [authenticate, isAdmin], issueController.returnBook);
router.get('/', [authenticate, isAdmin], issueController.getAllIssues);
router.get('/overdue', [authenticate, isAdmin], issueController.getOverdueBooks);
router.post('/reminders', [authenticate, isAdmin], issueController.sendReminders);

// Student and admin routes
router.get('/student/:studentId', authenticate, issueController.getStudentIssues);

module.exports = router; 