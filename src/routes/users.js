const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { protect,authorize } = require('../middlewares/auth');

// GET all users
router.get('/', protect, authorize, usersController.getAllUsers);

// GET user by ID
router.get('/:id', usersController.getUserById);

// CREATE new user
router.post('/', usersController.createUser);

// UPDATE password (protected)
router.put('/update-password', protect, usersController.updatePassword);

// UPDATE user by ID
router.put('/:id', usersController.updateUser);

// DELETE user by ID
router.delete('/:id', usersController.deleteUser);

// UPDATE user role (admin only)
router.put('/:id/role', protect, authorize, usersController.updateUserRole);

module.exports = router;