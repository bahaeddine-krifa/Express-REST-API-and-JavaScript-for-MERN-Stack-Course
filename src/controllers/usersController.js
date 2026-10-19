const User = require('../models/User');
const { estNonVide, estEmailValide } = require('../utils/validators');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users');
    const users = await User.find().select('-password');
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
    console.log('Request body:', req.body);
    console.log('Received age:', req.body.age);
    // Use our custom validation utilities
    const { name, email, password, age, role } = req.body;

    // Validate name is not empty
    if (!estNonVide(name)) {
      return res.status(400).json({ error: 'Name is required and cannot be empty' });
    }

    // Validate email format
    if (!email || !estEmailValide(email)) {
      return res.status(400).json({ error: 'Email is required and must be valid (contain @ and .)' });
    }

    // Validate password
    if (!estNonVide(password) || password.length < 6) {
      return res.status(400).json({ error: 'Password is required and must be at least 6 characters long' });
    }

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      age: age !== undefined ? Number(age) : undefined,
      role: role || 'user'
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User created successfully!',
      user: savedUser.getProfile() // Return the user profile without password
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
  console.log('Request body for update:', req.body);
  try {
    const { name, email, password, age, role } = req.body;
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

    if (password !== undefined) {
      if (!estNonVide(password) || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      updateData.password = password;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    if (age !== undefined) {
      updateData.age = Number(age);
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
      user: updatedUser.getProfile() // Return the user profile without password
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

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide both old and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get user from token (set by protect middleware)
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save user
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};