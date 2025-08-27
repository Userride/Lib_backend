const Book = require('../models/Book');
const mongoose = require('mongoose');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    // Use Mongoose Model to find books
    const books = await Book.find().sort({ id: 1 });
    
    // Also fetch books directly from collection and store in global variable
    const bookCollection = mongoose.connection.db.collection("book");
    global.bookdata = await bookCollection.find({}).toArray();
    console.log("Fetched book Data:", global.bookdata);
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Search books
exports.searchBooks = async (req, res) => {
  try {
    const { title, author, subject, semester } = req.query;
    let query = {};
    
    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (semester) query.semester = semester;
    
    const books = await Book.find(query).sort({ id: 1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add new book
exports.addBook = async (req, res) => {
  try {
    const { id, title, author, subject, semester, publicationYear, imageUrl } = req.body;
    
    // Check if book with the same ID already exists
    const existingBook = await Book.findOne({ id });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ID already exists' });
    }
    
    // Create new book
    const newBook = new Book({
      id,
      title,
      author,
      subject,
      semester,
      publicationYear,
      imageUrl,
      addedBy: req.user._id
    });
    
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, subject, semester, publicationYear, imageUrl, available } = req.body;
    
    // Find book by ID
    let book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update book fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (subject) book.subject = subject;
    if (semester !== undefined) book.semester = semester;
    if (publicationYear !== undefined) book.publicationYear = publicationYear;
    if (imageUrl) book.imageUrl = imageUrl;
    if (available !== undefined) book.available = available;
    
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await book.deleteOne();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Seed books
exports.seedBooks = async (req, res) => {
  try {
    // Books data
    const booksData = [
      {
        "id": 1,
        "title": "Introduction to Algorithms",
        "author": "Thomas H. Cormen",
        "subject": "Algorithms",
        "semester": 4,
        "publicationYear": 2009,
        "available": true
      },
      {
        "id": 2,
        "title": "Computer Networks",
        "author": "Andrew S. Tanenbaum",
        "subject": "Networking",
        "semester": 5,
        "publicationYear": 2011,
        "available": true
      },
      {
        "id": 3,
        "title": "Operating System Concepts",
        "author": "Abraham Silberschatz",
        "subject": "Operating Systems",
        "semester": 4,
        "publicationYear": 2012,
        "available": true
      },
      {
        "id": 4,
        "title": "Database System Concepts",
        "author": "Abraham Silberschatz",
        "subject": "Databases",
        "semester": 5,
        "publicationYear": 2010,
        "available": true
      },
      {
        "id": 5,
        "title": "Artificial Intelligence: A Modern Approach",
        "author": "Stuart Russell",
        "subject": "Artificial Intelligence",
        "semester": 6,
        "publicationYear": 2020,
        "available": true
      },
      {
        "id": 6,
        "title": "Computer Organization and Design",
        "author": "David A. Patterson",
        "subject": "Computer Architecture",
        "semester": 3,
        "publicationYear": 2014,
        "available": true
      },
      {
        "id": 7,
        "title": "Java: The Complete Reference",
        "author": "Herbert Schildt",
        "subject": "Programming",
        "semester": 2,
        "publicationYear": 2018,
        "available": true
      },
      {
        "id": 8,
        "title": "C Programming Language",
        "author": "Brian W. Kernighan",
        "subject": "Programming",
        "semester": 1,
        "publicationYear": 1988,
        "available": true
      },
      {
        "id": 9,
        "title": "Discrete Mathematics and Its Applications",
        "author": "Kenneth H. Rosen",
        "subject": "Mathematics",
        "semester": 2,
        "publicationYear": 2013,
        "available": true
      },
      {
        "id": 10,
        "title": "Computer Graphics with OpenGL",
        "author": "Donald Hearn",
        "subject": "Graphics",
        "semester": 6,
        "publicationYear": 2010,
        "available": true
      },
      {
        "id": 11,
        "title": "Data Communications and Networking",
        "author": "Behrouz A. Forouzan",
        "subject": "Networking",
        "semester": 5,
        "publicationYear": 2012,
        "available": true
      },
      {
        "id": 12,
        "title": "Let Us C",
        "author": "Yashavant Kanetkar",
        "subject": "Programming",
        "semester": 1,
        "publicationYear": 2016,
        "available": true
      },
      {
        "id": 13,
        "title": "The Art of Computer Programming",
        "author": "Donald E. Knuth",
        "subject": "Algorithms",
        "semester": 6,
        "publicationYear": 2011,
        "available": true
      },
      {
        "id": 14,
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "subject": "Software Engineering",
        "semester": 5,
        "publicationYear": 2008,
        "available": true
      },
      {
        "id": 15,
        "title": "Compiler Design",
        "author": "Aho, Lam, Sethi, Ullman",
        "subject": "Compilers",
        "semester": 6,
        "publicationYear": 2006,
        "available": true
      },
      {
        "id": 16,
        "title": "Python Crash Course",
        "author": "Eric Matthes",
        "subject": "Programming",
        "semester": 2,
        "publicationYear": 2019,
        "available": true
      },
      {
        "id": 17,
        "title": "Big Data: Principles and best practices",
        "author": "Nathan Marz",
        "subject": "Big Data",
        "semester": 7,
        "publicationYear": 2015,
        "available": true
      },
      {
        "id": 18,
        "title": "Data Mining Concepts and Techniques",
        "author": "Jiawei Han",
        "subject": "Data Mining",
        "semester": 7,
        "publicationYear": 2011,
        "available": true
      },
      {
        "id": 19,
        "title": "Cryptography and Network Security",
        "author": "William Stallings",
        "subject": "Security",
        "semester": 6,
        "publicationYear": 2014,
        "available": true
      },
      {
        "id": 20,
        "title": "Cloud Computing",
        "author": "Rajkumar Buyya",
        "subject": "Cloud Computing",
        "semester": 7,
        "publicationYear": 2013,
        "available": true
      }
    ];

    // Clear existing books
    await Book.deleteMany({});
    
    // Insert all books
    await Book.insertMany(booksData);
    
    // Also update global.bookdata
    const bookCollection = mongoose.connection.db.collection("book");
    global.bookdata = await bookCollection.find({}).toArray();
    
    res.status(200).json({ message: 'Books seeded successfully', count: booksData.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding books', error: error.message });
  }
}; 