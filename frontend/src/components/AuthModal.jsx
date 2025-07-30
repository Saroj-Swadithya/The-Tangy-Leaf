import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import '../App.css'; 

const AuthModal = ({ open, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); 
  };

  const switchMode = () => {
    setIsLogin(prev => !prev);
    setError('');
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    // --- FIX: Use a relative URL for the API endpoint ---
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'; 
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password };

    try {
      const res = await axios.post(endpoint, payload);
      onLoginSuccess(res.data.token);
    } catch (err) {
      setError(err.response?.data?.msg || `An error occurred. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="auth-modal-content">
        <button className="auth-close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="auth-header">
          <h2>{isLogin ? 'LOGIN' : 'SIGN UP'}</h2>
          <p>{isLogin ? 'To access your profile' : 'Create your account'}</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
            </div>
          )}
          <div className="form-group">
            <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} required />
          </div>
          {!isLogin && (
            <div className="form-group phone-group">
              <span className="country-code">IN +91</span>
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />
            </div>
          )}
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
          </div>
          {!isLogin && (
            <div className="form-group">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
            </div>
          )}
          {error && <p className="auth-error-message">{error}</p>}
          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'SUBMIT'}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); switchMode(); }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;