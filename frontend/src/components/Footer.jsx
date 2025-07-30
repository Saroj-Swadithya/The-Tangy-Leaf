import React from 'react';
import '../App.css'; // Assuming your styles are in App.css
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>The Tangy Leaf</h3>
          <p>Fresh flavors since 2025</p>
          <p>All rights reserved &copy; 2025</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/cafe-menu">Menu</a></li>
            <li><a href="/order">Order Online</a></li>
            <li><a href="/cafe-finder">Locations</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;