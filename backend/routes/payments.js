const express = require('express');
const Razorpay = require('razorpay');
require('dotenv').config();

const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;