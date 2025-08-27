const BookIssue = require('../models/BookIssue');
const Book = require('../models/Book');
const User = require('../models/User');
const twilio = require('twilio');

// Initialize Twilio client if credentials are provided
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Issue a book to a student
exports.issueBook = async (req, res) => {
  try {
    const { bookId, studentId, dueDate } = req.body;
    
    // Find the book
    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book is available
    if (!book.available) {
      return res.status(400).json({ message: 'Book is not available for issuance' });
    }
    
    // Find the student
    const student = await User.findOne({ 
      $or: [
        { _id: studentId },
        { studentId: studentId }
      ]
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Create new book issue record
    const bookIssue = new BookIssue({
      book: book._id,
      student: student._id,
      dueDate: new Date(dueDate),
      issuedBy: req.user._id
    });
    
    // Update book availability
    book.available = false;
    
    // Save both records
    await Promise.all([
      bookIssue.save(),
      book.save()
    ]);
    
    // Populate book and student details
    await bookIssue.populate('book');
    await bookIssue.populate('student', '-password');
    
    res.status(201).json(bookIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;
    
    // Find the issue record
    const bookIssue = await BookIssue.findById(issueId);
    if (!bookIssue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }
    
    // Check if book is already returned
    if (bookIssue.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }
    
    // Find the book
    const book = await Book.findById(bookIssue.book);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update book issue record
    bookIssue.returnDate = new Date();
    bookIssue.status = 'returned';
    
    // Calculate fine if returned late
    const fine = bookIssue.calculateFine();
    bookIssue.fine = fine;
    
    // Update book availability
    book.available = true;
    
    // Save both records
    await Promise.all([
      bookIssue.save(),
      book.save()
    ]);
    
    // Populate book and student details
    await bookIssue.populate('book');
    await bookIssue.populate('student', '-password');
    
    res.status(200).json(bookIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all issued books
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await BookIssue.find()
      .populate('book')
      .populate('student', '-password')
      .populate('issuedBy', '-password')
      .sort({ issueDate: -1 });
    
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get issued books for a specific student
exports.getStudentIssues = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findOne({ 
      $or: [
        { _id: studentId },
        { studentId: studentId }
      ]
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const issues = await BookIssue.find({ student: student._id })
      .populate('book')
      .sort({ issueDate: -1 });
    
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get overdue books
exports.getOverdueBooks = async (req, res) => {
  try {
    const today = new Date();
    
    const overdueIssues = await BookIssue.find({
      dueDate: { $lt: today },
      status: 'issued'
    })
      .populate('book')
      .populate('student', '-password');
    
    res.status(200).json(overdueIssues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Send reminder for overdue books
exports.sendReminders = async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(400).json({ message: 'Twilio credentials not configured' });
    }
    
    const today = new Date();
    
    const overdueIssues = await BookIssue.find({
      dueDate: { $lt: today },
      status: 'issued'
    })
      .populate('book')
      .populate('student');
    
    if (overdueIssues.length === 0) {
      return res.status(200).json({ message: 'No overdue books found' });
    }
    
    const remindersSent = [];
    const failedReminders = [];
    
    // Send SMS to each student with overdue books
    for (const issue of overdueIssues) {
      if (!issue.student.phone) {
        failedReminders.push({
          student: issue.student.name,
          book: issue.book.title,
          reason: 'No phone number available'
        });
        continue;
      }
      
      try {
        const daysOverdue = Math.ceil(
          (today - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24)
        );
        
        await twilioClient.messages.create({
          body: `Reminder: Your book "${issue.book.title}" was due ${daysOverdue} days ago. Please return it to the library as soon as possible.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: issue.student.phone
        });
        
        remindersSent.push({
          student: issue.student.name,
          book: issue.book.title,
          phone: issue.student.phone
        });
      } catch (error) {
        failedReminders.push({
          student: issue.student.name,
          book: issue.book.title,
          reason: error.message
        });
      }
    }
    
    res.status(200).json({
      remindersSent,
      failedReminders,
      totalSent: remindersSent.length,
      totalFailed: failedReminders.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 