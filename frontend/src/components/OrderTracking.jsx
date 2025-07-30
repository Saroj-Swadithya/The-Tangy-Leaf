import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaMotorcycle, FaStore, FaHome } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import { useOrderStatus } from './useOrderStatus';
import '../App.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3dhdGh5MDkiLCJhIjoiY21kYzI1NTBwMHp0cDJpcHNzYmxrNnZqcyJ9.9EIffF7wTqHhJYu3PFWuwg';

const OrderTracking = ({ user, onLogout, onLoginClick }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const liveStatus = useOrderStatus(order?.orderDate);
  const storeLocation = useMemo(() => ({ longitude: 76.9558, latitude: 11.0168 }), []);
  const userLocation = useMemo(() => ({
    longitude: storeLocation.longitude + 0.03 + (parseInt(orderId.slice(-2), 16) / 10000),
    latitude: storeLocation.latitude + 0.03 + (parseInt(orderId.slice(-4, -2), 16) / 10000),
  }), [orderId, storeLocation]);
  const [deliveryLocation, setDeliveryLocation] = useState(storeLocation);
  const statusTimeline = ['Order Confirmed', 'Preparing Food', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // --- FIX: Use a relative URL ---
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        setError('Order not found or you are not authorized to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && liveStatus === 'Out for Delivery') {
      const timeElapsedInStatus = Date.now() - (new Date(order.orderDate).getTime() + 15000);
      const totalDurationOfStatus = 10000;
      const progress = Math.min(timeElapsedInStatus / totalDurationOfStatus, 1);
      const newLongitude = storeLocation.longitude + (userLocation.longitude - storeLocation.longitude) * progress;
      const newLatitude = storeLocation.latitude + (userLocation.latitude - storeLocation.latitude) * progress;
      setDeliveryLocation({ longitude: newLongitude, latitude: newLatitude });
    } else if (order && liveStatus === 'Delivered') {
      setDeliveryLocation(userLocation);
    } else {
      setDeliveryLocation(storeLocation);
    }
  }, [liveStatus, order, storeLocation, userLocation]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found.</div>;

  const currentStatusIndex = statusTimeline.indexOf(liveStatus);

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <div className="tracking-container">
        <h1>Tracking Order: #{order._id.slice(-6).toUpperCase()}</h1>
        <p className="current-status-display">Current Status: <strong>{liveStatus}</strong></p>
        <div className="tracking-content">
          <div className="tracking-details">
            <div className="status-tracker">
              {statusTimeline.map((status, index) => (
                <div key={status} className={`status-step ${index <= currentStatusIndex ? 'completed' : ''}`}>
                  <div className="status-dot"></div>
                  <div className="status-label">{status}</div>
                </div>
              ))}
              <div className="status-line" style={{ width: `${(currentStatusIndex / (statusTimeline.length - 1)) * 100}%` }}></div>
            </div>
            <div className="order-summary-box">
              <h2>Order Summary</h2>
              {order.items.map(item => (
                <div key={item.name} className="summary-item">
                  <span>{item.quantity} x {item.name}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="total-row grand-total">
                <span>Total Paid:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="tracking-map">
            <Map
              initialViewState={{
                longitude: (storeLocation.longitude + userLocation.longitude) / 2,
                latitude: (storeLocation.latitude + userLocation.latitude) / 2,
                zoom: 12,
              }}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              style={{ width: '100%', height: '100%' }}
            >
              <Marker longitude={storeLocation.longitude} latitude={storeLocation.latitude}>
                <div className="map-marker-label"><FaStore size={30} color="#E53935" /><span>Cafe</span></div>
              </Marker>
              <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
                <div className="map-marker-label"><FaHome size={30} color="#1E88E5" /><span>Home</span></div>
              </Marker>
              {liveStatus === 'Out for Delivery' && (
                <Marker longitude={deliveryLocation.longitude} latitude={deliveryLocation.latitude}>
                  <FaMotorcycle size={30} color="#43A047" className="delivery-icon" />
                </Marker>
              )}
            </Map>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderTracking;