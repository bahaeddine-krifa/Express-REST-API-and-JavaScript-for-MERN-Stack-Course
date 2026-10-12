const User = require('../models/User');
const { estNonVide, estEmailValide } = require('../utils/validators');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ total: users.length, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    // Use our custom validation utilities
    const { name, email, role } = req.body;

    // Validate name is not empty
    if (!estNonVide(name)) {
      return res.status(400).json({ error: 'Name is required and cannot be empty' });
    }

    // Validate email format
    if (!email || !estEmailValide(email)) {
      return res.status(400).json({ error: 'Email is required and must be valid (contain @ and .)' });
    }

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'student',
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User created successfully!',
      user: savedUser.getProfile() // Use instance method to get safe profile
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updateData = {};

    if (name !== undefined) {
      if (!estNonVide(name)) {
        return res.status(400).json({ error: 'Name cannot be empty' });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      if (!email || !estEmailValide(email)) {
        return res.status(400).json({ error: 'Email must be valid (contain @ and .)' });
      }
      updateData.email = email.trim().toLowerCase();
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully!',
      user: updatedUser.getProfile() // Use instance method to get safe profile
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully!',
      user: deletedUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};