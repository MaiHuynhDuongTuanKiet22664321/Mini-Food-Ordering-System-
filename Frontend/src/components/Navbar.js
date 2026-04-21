import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Notifications from './Notifications';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <h1>🍔 FoodOrder</h1>
        </div>
        <div className="navbar-menu">
          <button onClick={() => navigate('/')}>Menu</button>
          <button onClick={() => navigate('/cart')}>
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {user ? (
            <>
              <button onClick={() => navigate('/order')}>Order</button>
              <Notifications />
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
