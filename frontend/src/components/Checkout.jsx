import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../App.css';

const Checkout = ({ user, onLogout, onLoginClick, cart, handleQuantityChange }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ name: user?.name || '', street: '', city: '', pincode: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState('');

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const subtotal = useMemo(() => (cart || []).reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
  const taxes = subtotal * 0.05;
  const deliveryFee = 49;
  const total = subtotal + taxes + deliveryFee;
  const totalInPaisa = Math.round(total * 100);

  const handlePayment = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
    setIsProcessing(true);

    try {
      // --- FIX: Use a relative URL ---
      const orderResponse = await axios.post('/api/payment/razorpay-order', {
        amount: totalInPaisa,
        currency: 'INR',
      });
      const razorpayOrder = orderResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'The Tangy Leaf',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          const orderDetails = {
            items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
            totalAmount: total,
            deliveryAddress: address,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid',
            razorpayPaymentId: response.razorpay_payment_id,
          };
          
          // --- FIX: Use a relative URL ---
          const dbResponse = await axios.post('/api/orders/create', orderDetails);
          setOrderId(dbResponse.data._id.slice(-6).toUpperCase());
          setShowConfirmation(true);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#4CAF50',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Payment failed:", err);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    (cart || []).forEach(item => handleQuantityChange(item, -item.quantity));
    navigate('/');
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Final Step - Your Order</h1>
          <p>Please confirm your details to place the order.</p>
        </div>
        <div className="checkout-content">
          <div className="checkout-details">
            <div className="checkout-section">
              <h2>Delivery Address</h2>
              <input type="text" name="name" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} placeholder="Full Name" required />
              <input type="text" name="street" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Street Address" required />
              <input type="text" name="city" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="City" required />
              <input type="text" name="pincode" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} placeholder="Pincode" required />
            </div>
            <button onClick={handlePayment} className="place-order-btn" disabled={!cart || cart.length === 0 || isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart && cart.length > 0 ? cart.map(item => (
                <div key={item.name} className="summary-item">
                  <span>{item.quantity} x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              )) : <p>Your cart is empty.</p>}
            </div>
            <div className="summary-totals">
              <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="total-row"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
              <div className="total-row"><span>Taxes (5%)</span><span>₹{taxes.toFixed(2)}</span></div>
              <div className="total-row grand-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showConfirmation && (
        <div className="modal">
          <div className="confirmation-card">
            <div className="confirmation-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order. Your food is on its way!</p>
            <p className="order-number">Order ID: <strong>{orderId}</strong></p>
            <button onClick={closeConfirmation} className="close-confirmation-btn">Continue Shopping</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;