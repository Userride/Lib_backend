const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample book data
const books = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    subject: "Algorithms",
    semester: 4,
    publicationYear: 2009,
    available: true
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    author: "Robert Lafore",
    subject: "Data Structures",
    semester: 3,
    publicationYear: 2008,
    available: true
  },
  {
    id: 3,
    title: "Database Management Systems",
    author: "Raghu Ramakrishnan",
    subject: "Database",
    semester: 5,
    publicationYear: 2002,
    available: true
  },
  {
    id: 4,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    subject: "Operating Systems",
    semester: 5,
    publicationYear: 2012,
    available: true
  },
  {
    id: 5,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    subject: "Networking",
    semester: 6,
    publicationYear: 2010,
    available: true
  }
];

// Sample user data
const users = [
  {
    name: "Admin User",
    email: "admin@library.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Super Admin",
    email: "superadmin@library.com",
    password: "superadmin123",
    role: "super-admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "john123",
    role: "user",
    studentId: "S12345"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "jane123",
    role: "user",
    studentId: "S12346"
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});

    // Insert books
    await Book.insertMany(books);
    console.log('Books seeded successfully');

    // Insert users
    await User.insertMany(users);
    console.log('Users seeded successfully');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 