const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

// Middleware to check for admin role
exports.isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
    return res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
  next();
};

// Middleware to check for super-admin role
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super-admin') {
    return res.status(403).json({ message: 'Access denied, super-admin privileges required' });
  }
  next();
}; 