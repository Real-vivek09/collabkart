const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PaymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: String,
  amount: Number,
  status: String, // pending, completed
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', PaymentSchema);

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise me convert
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const payment = new Payment({
      userId: req.user.uid,
      orderId: order.id,
      amount,
      status: 'pending',
    });
    await payment.save();

    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const crypto = require('crypto');

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      await Payment.findOneAndUpdate({ orderId }, { status: 'completed' });
      res.json({ message: 'Payment verified' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (err) {
    console.error('Payment history error:', err);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};
