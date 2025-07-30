import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import Home from './components/Home';
import Order from './components/Order';
import CafeMenu from './components/CafeMenu';
import CafeFinder from './components/CafeFinder';
import MobileApp from './components/MobileApp';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import MyOrders from './components/MyOrders';
import OrderTracking from './components/OrderTracking'; 
import './App.css';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        // --- FIX: Use a relative URL for the API call ---
        const res = await axios.get('/api/auth');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user. Token might be invalid.", err);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoading(true); 
    loadUser();
    setAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthToken(null);
  };
  const handleQuantityChange = (item, amount) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + amount;
        if (newQuantity <= 0) {
          return currentCart.filter(cartItem => cartItem.id !== item.id);
        }
        return currentCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
        );
      } else if (amount > 0) {
        return [...currentCart, { ...item, quantity: amount }];
      }
      return currentCart;
    });
  };

  if (isLoading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Router>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Chatbot />
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} />} />
        <Route path="/order" element={<Order user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} cart={cart} handleQuantityChange={handleQuantityChange} />} />
        <Route path="/cafe-menu" element={<CafeMenu user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} cart={cart} handleQuantityChange={handleQuantityChange} />} />
        <Route path="/cafe-finder" element={<CafeFinder user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} />} />
        <Route path="/mobile-app" element={<MobileApp user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} />} />
        <Route path="/checkout" element={<Checkout user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} cart={cart} handleQuantityChange={handleQuantityChange} />} />
        <Route path="/my-orders" element={<MyOrders user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} />} />
        <Route path="/track-order/:orderId" element={<OrderTracking user={user} onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)} />} />
      </Routes>
    </Router>
  );
}

export default App;