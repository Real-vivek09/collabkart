const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const userController = require('../controllers/userController');

// POST register user (open route)
router.post('/register', userController.registerUser);

// GET email verification link (open route)
router.get('/verify-email', userController.verifyEmail);

// GET user profile (protected)
router.get('/profile/:firebaseUid', verifyToken, userController.getUserProfile);

// PUT update profile with photo upload (protected)
router.put('/profile/:firebaseUid', verifyToken, userController.updateUserProfile);

module.exports = router;
