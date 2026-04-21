import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, createPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Order.css';

const Order = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token) {
      setError('Please login to place an order');
      setLoading(false);
      return;
    }

    try {
      // Create order
      const orderData = {
        userId: user.id,
        items: cart.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal * 1.1, // Including tax
        address: formData.address,
        phone: formData.phone,
        notes: formData.notes,
      };

      const orderResponse = await createOrder(orderData);
      setOrderId(orderResponse.id);
      setOrderCreated(true);

      // Clear cart immediately after order is created
      clearCart();

      // Create payment
      const paymentData = {
        orderId: orderResponse.id,
        userId: user.id,
        amount: orderResponse.totalAmount,
        method: 'credit_card',
      };

      await createPayment(paymentData);

      alert('Order placed successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderCreated) {
    return (
      <div className="order-container">
        <h1>Place Order</h1>
        <div className="empty-order">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')}>Browse Foods</button>
        </div>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="order-container">
        <div className="order-success">
          <h1>Order Placed Successfully!</h1>
          <p>Your order ID: {orderId}</p>
          <p>Thank you for your purchase!</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h1>Place Your Order</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="order-content">
        <div className="order-form">
          <h2>Delivery Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Notes (optional):</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${Number(cartTotal).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${(Number(cartTotal) * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(Number(cartTotal) * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
