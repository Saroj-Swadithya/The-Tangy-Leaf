import React, { useState, useEffect } from 'react';
import '../App.css';
import Navbar from './Navbar'; // Import the reusable Navbar
import banner1 from '../images/banner1.png';
import banner2 from '../images/banner2.png';
import banner3 from '../images/banner3.png';
import banner4 from '../images/banner4.png';
import banner5 from '../images/banner5.jpeg';
import menu1 from '../images/menu1.png';
import menu2 from '../images/menu2.png';
import menu3 from '../images/menu3.png';
import menu4 from '../images/menu4.png';
import Chatbot from './Chatbot';
import Footer from './Footer';

const heroImages = [banner1, banner2, banner3, banner4, banner5];

const menuItems = [
  {
    img: menu1,
    name: 'Citrus Blast Sandwich',
    description: 'Avocado, lime zest, grilled chicken',
    price: '₹249',
  },
  {
    img: menu2,
    name: 'Tangy Leaf Burger',
    description: 'Signature lime sauce, crisp lettuce',
    price: '₹299',
  },
  {
    img: menu3,
    name: 'Zesty French Fries',
    description: 'Lime-seasoned potato perfection',
    price: '₹199',
  },
  {
    img: menu4,
    name: 'Classic Peach Lime Mojito',
    description: 'Fresh mint, lime, soda water',
    price: '₹179',
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container">
      <div className="hero-content">
        <img
          src={heroImages[current]}
          alt="Tangy Leaf"
          className="hero-image"
          style={{ width: '100%', height: '500px', objectFit: 'cover' }}
        />
        <div className="hero-text">TANGY LEGACY SINCE 2025</div>
        <div className="slider-dots">
          {heroImages.map((_, idx) => (
            <span
              key={idx}
              className={`dot${current === idx ? ' active' : ''}`}
              onClick={() => setCurrent(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home({ user, onLogout, onLoginClick }) {
  return (
    <>
      {/* Navbar receives props for login/logout handling */}
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />

      <HeroCarousel />

      <div className="color-bands">
        <div className="band lime">
          <h2>Fresh Sandwiches</h2>
          <p>Crafted with garden-fresh ingredients</p>
        </div>
        <div className="band yellow">
          <h2>Zesty Burgers</h2>
          <p>Bursting with tangy flavors</p>
        </div>
        <div className="band mint">
          <h2>Refreshing Mojitos</h2>
          <p>Cool down with our signature drinks</p>
        </div>
      </div>

      <div className="menu-highlights">
        <h2>OUR SPECIALTIES</h2>
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div className="menu-item" key={index}>
              <img src={item.img} alt={item.name} className="menu-image" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <Chatbot />
    </>
  );
}

export default Home;
