import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Your styles
import Navbar from './Navbar'; // Import the reusable Navbar
import Footer from './Footer'; // Import the reusable Footer
import sandwichImg1 from '../images/menu1.png';
import sandwichImg2 from '../images/order1.png';
import burgerImg1 from '../images/menu2.png';
import burgerImg2 from '../images/order2.png';
import friesImg from '../images/menu3.png';
import drinkImg from '../images/menu4.png';

const menuData = [
  { id: 1, name: 'Citrus Blast Sandwich', description: 'Avocado, lime zest, grilled chicken', price: 249, image: sandwichImg1, category: 'Sandwiches' },
  { id: 2, name: 'Veggie Delight', description: 'Fresh vegetables, herb mayo, multigrain bread', price: 219, image: sandwichImg2, category: 'Sandwiches' },
  { id: 3, name: 'Tangy Leaf Burger', description: 'Signature lime sauce, crisp lettuce', price: 299, image: burgerImg1, category: 'Burgers' },
  { id: 4, name: 'Spicy Chicken Burger', description: 'Crispy chicken, spicy mayo, pickles', price: 319, image: burgerImg2, category: 'Burgers' },
  { id: 5, name: 'Zesty French Fries', description: 'Lime-seasoned potato perfection', price: 199, image: friesImg, category: 'Sides' },
  { id: 6, name: 'Classic Peach Lime Mojito', description: 'Fresh mint, lime, soda water', price: 179, image: drinkImg, category: 'Drinks' },
];

const categories = ['Sandwiches', 'Burgers', 'Sides', 'Drinks'];
const DELIVERY_FEE = 49;

function Order({ user, onLogout, onLoginClick, cart, handleQuantityChange }) {
  const [activeCategory, setActiveCategory] = useState('Sandwiches');

  const getQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const subtotal = useMemo(() => {
    // Ensure cart is an array before calling reduce
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const total = subtotal + DELIVERY_FEE;

  const filteredMenu = menuData.filter(item => item.category === activeCategory);

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />

      <div className="order-container">
        <h1>Order Online</h1>
        <p className="subtitle">Get your favorite Tangy Leaf dishes delivered to your doorstep</p>
        <div className="order-content">
          <div className="menu-selection">
            <h2>Our Menu</h2>
            <div className="category-tabs">
              {categories.map(category => (
                <button
                  key={category}
                  className={`tab-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="menu-list">
              {filteredMenu.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">₹{item.price}</span>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item, -1)} disabled={getQuantity(item.id) === 0}>-</button>
                    <span className="quantity">{getQuantity(item.id)}</span>
                    <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-summary">
            <h2>Your Order</h2>
            <div className="summary-items">
              {cart.length === 0 ? (
                <p className="empty-message">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.quantity} x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))
              )}
            </div>
            <div className="summary-totals">
              <div className="total-row"><span>Subtotal:</span><span>₹{subtotal}</span></div>
              <div className="total-row"><span>Delivery Fee:</span><span>₹{DELIVERY_FEE}</span></div>
              <div className="total-row grand-total"><span>Total:</span><span>₹{total}</span></div>
            </div>
            <Link to="/checkout" className={`checkout-btn ${cart.length === 0 ? 'disabled' : ''}`}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Order;
