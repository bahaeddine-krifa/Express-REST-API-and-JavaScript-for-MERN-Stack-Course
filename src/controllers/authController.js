const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs') ;
const { estNonVide, estEmailValide } = require('../utils/validators');

// Generate JWT token
const generateToken = (id,role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;

    // Validate inputs
    if (!estNonVide(name)) {
      return res.status(400).json({ error: 'Name is required and cannot be empty' });
    }

    if (!email || !estEmailValide(email)) {
      return res.status(400).json({ error: 'Email is required and must be valid' });
    }

    if (!estNonVide(password) || password.length < 6) {
      return res.status(400).json({ error: 'Password is required and must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    // Create user - force role to 'user' for public registration (privilege escalation defense)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      role: 'user' // Always set to 'user' for public registration
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        token: generateToken(user._id,user.role),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request body:', req.body); // Debugging line
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password,user.password);
    console.log('Password match:', isMatch); // Debugging line

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials1' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id,user.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};