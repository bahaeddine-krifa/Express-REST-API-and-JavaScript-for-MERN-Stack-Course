const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET all users
router.get('/', usersController.getAllUsers);

// GET user by ID
router.get('/:id', usersController.getUserById);

// CREATE new user
router.post('/', usersController.createUser);

// UPDATE user by ID
router.put('/:id', usersController.updateUser);

// DELETE user by ID
router.delete('/:id', usersController.deleteUser);

module.exports = router;