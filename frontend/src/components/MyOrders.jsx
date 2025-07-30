import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { useOrderStatus } from './useOrderStatus';
import '../App.css';

const OrderCard = ({ order }) => {
  const liveStatus = useOrderStatus(order.orderDate);
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <span className="order-card-label">ORDER PLACED</span>
          <span>{new Date(order.orderDate).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="order-card-label">TOTAL</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
        <div>
          <span className="order-card-label">ORDER #</span>
          <span>{order._id.slice(-8).toUpperCase()}</span>
        </div>
      </div>
      <div className="order-card-body">
        <div>
          <h3 className="live-status">{liveStatus}</h3>
          <p>Your order is currently {liveStatus.toLowerCase()}.</p>
        </div>
        <Link to={`/track-order/${order._id}`} className="track-order-btn">
          Track Order
        </Link>
      </div>
    </div>
  );
}

const MyOrders = ({ user, onLogout, onLoginClick }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // --- FIX: Use a relative URL ---
        const res = await axios.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <div className="my-orders-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;