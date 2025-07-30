const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    name: String,
    street: String,
    city: String,
    pincode: String,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
  // --- ADD THIS NEW FIELD ---
  orderStatus: {
    type: String,
    enum: ['Order Confirmed', 'Preparing Food', 'Out for Delivery', 'Delivered'],
    default: 'Order Confirmed',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);