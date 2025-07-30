const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST api/payment/razorpay-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/razorpay-order', auth, async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount, // amount in the smallest currency unit (paisa)
    currency: currency,
    receipt: `receipt_order_${Math.random().toString(36).substr(2, 9)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send('Error creating Razorpay order');
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;