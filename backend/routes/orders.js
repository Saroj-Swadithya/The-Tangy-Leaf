const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
// @route   POST api/orders/create
// @desc    Create a new order
// @access  Private
router.post('/create', auth, async (req, res) => {
  const { items, totalAmount, deliveryAddress, paymentMethod, paymentStatus, razorpayPaymentId } = req.body;
  try {
    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'Paid',
      razorpayPaymentId
    });
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Error fetching user's orders:", err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (!order.user.equals(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found (Invalid ID)' });
    }
    console.error("Error fetching single order:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;