import React, { useState } from 'react';
import Navbar from './Navbar'; // Import Navbar
import Footer from './Footer';   // Import Footer
import '../App.css';

// Import images
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

// It now receives all the props it needs for the Navbar and cart
const CafeMenu = ({ user, onLogout, onLoginClick, cart, handleQuantityChange }) => {
  const [activeCategory, setActiveCategory] = useState('Sandwiches');
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const addItem = (item) => {
    handleQuantityChange(item, 1);
    showNotification(`${item.name} added to cart!`);
  };

  const getQuantity = (itemId) => cart.find(item => item.id === itemId)?.quantity || 0;

  const filteredMenu = menuData.filter(item => item.category === activeCategory);

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <div className="cafe-menu-container">
        {notification && <div className="add-to-cart-notification">{notification}</div>}
        <div className="menu-header">
          <h1>Explore Our Menu</h1>
          <p>Discover the fresh and tangy flavors of The Tangy Leaf.</p>
        </div>
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
        <div className="fancy-menu-grid">
          {filteredMenu.map(item => (
            <div key={item.id} className="fancy-menu-card">
              <img src={item.image} alt={item.name} className="card-image" />
              <div className="card-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="card-footer">
                  <span className="price">₹{item.price}</span>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item, -1)} disabled={getQuantity(item.id) === 0}>-</button>
                    <span>{getQuantity(item.id)}</span>
                    <button onClick={() => addItem(item)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CafeMenu;