const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  available: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
BookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', BookSchema); 