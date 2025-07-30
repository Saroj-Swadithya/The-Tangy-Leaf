import { useState, useEffect } from 'react';

// This custom hook will calculate the current order status based on time elapsed.
export const useOrderStatus = (orderDate) => {
  const [status, setStatus] = useState('Order Confirmed');

  const statuses = [
    { name: 'Order Confirmed', duration: 10 * 1000 }, // 10 seconds
    { name: 'Preparing Food', duration: 5 * 1000 },  // 5 seconds
    { name: 'Out for Delivery', duration: 10 * 1000 },// 10 seconds
    { name: 'Delivered', duration: Infinity },          // Final state
  ];

  useEffect(() => {
    if (!orderDate) return;

    const updateStatus = () => {
      const timeElapsed = Date.now() - new Date(orderDate).getTime();
      let cumulativeDuration = 0;
      
      for (const s of statuses) {
        cumulativeDuration += s.duration;
        if (timeElapsed < cumulativeDuration) {
          setStatus(s.name);
          return;
        }
      }
      // If all durations have passed, it's delivered
      setStatus('Delivered');
    };

    updateStatus(); // Set initial status
    const interval = setInterval(updateStatus, 1000); // Check every second for status changes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [orderDate, statuses]);

  return status;
};