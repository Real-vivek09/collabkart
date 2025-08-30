const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.registerUser);

// Future routes (login) add karna ho toh yahaan karo

module.exports = router;
