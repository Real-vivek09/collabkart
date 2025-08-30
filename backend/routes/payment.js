const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');


// POST create Razorpay order
router.post('/create-order', verifyToken, paymentController.createOrder);

// POST verify payment (optional, add route if needed)
// router.post('/verify', verifyToken, paymentController.verifyPayment);

module.exports = router;
