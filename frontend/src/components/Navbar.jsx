import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../images/logo.jpeg';
import '../App.css';

const Navbar = ({ user, onLogout, onLoginClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = () => {
    // This function, passed from App.js, will clear the user's state.
    onLogout();
    // Hide the dropdown and mobile menu.
    setShowDropdown(false);
    setIsMenuOpen(false);
    // Explicitly navigate to the home page.
    navigate('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="The Tangy Leaf Logo" className="logo" />
        </Link>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-item" onClick={closeMenu}>Home</Link>
        <Link to="/cafe-menu" className="nav-item" onClick={closeMenu}>Cafe Menu</Link>
        <Link to="/order" className="nav-item" onClick={closeMenu}>Order Online</Link>
        <Link to="/cafe-finder" className="nav-item" onClick={closeMenu}>Cafe Finder</Link>
        <Link to="/mobile-app" className="nav-item" onClick={closeMenu}>Mobile App</Link>
      </div>

      <div className="navbar-right">
        <div className="nav-icons">
          {user ? (
            <div
              className="account-container"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="account-info">
                <FaUserCircle size={24} className="user-icon" />
                <span className="user-name">{user.name}</span>
              </div>
              {showDropdown && (
                <div className="dropdown">
                  <Link to="/my-orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>My Orders</Link>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="icon-item login-icon-btn" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>
              <FaUserCircle size={24} />
            </button>
          )}
        </div>
        
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;