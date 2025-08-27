const mongoose = require('mongoose');

const BookIssueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued'
  },
  fine: {
    type: Number,
    default: 0
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Calculate and update fine amount for overdue books
BookIssueSchema.methods.calculateFine = function() {
  const now = new Date();
  if (this.status === 'returned' || now <= this.dueDate) {
    return 0;
  }
  
  // Calculate days overdue
  const dueDate = new Date(this.dueDate);
  const timeDiff = Math.abs(now.getTime() - dueDate.getTime());
  const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Fine rate: $1 per day overdue
  return daysOverdue * 1;
};

module.exports = mongoose.model('BookIssue', BookIssueSchema); 