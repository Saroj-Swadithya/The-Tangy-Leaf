import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './AccountMenu.css'; // Optional for styling

const AccountMenu = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedUser) setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setShowDropdown(false);
    if (onLogout) onLogout();
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="account-container">
      <div className="account-info" onClick={toggleDropdown}>
        <FaUserCircle size={24} />
        {user && <span className="user-name">{user.fullName}</span>}
      </div>

      {showDropdown && user && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;