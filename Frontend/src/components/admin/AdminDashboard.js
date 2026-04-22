import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'food', label: 'Quản lý món ăn', icon: '🍔', path: '/admin/food' },
    { id: 'users', label: 'Quản lý người dùng', icon: '👥', path: '/admin/users' },
    { id: 'notifications', label: 'Quản lý thông báo', icon: '🔔', path: '/admin/notifications' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getCurrentMenuItem = () => {
    return menuItems.find(item => location.pathname === item.path) || menuItems[0];
  };

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>Hệ thống đặt món ăn</p>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <span className="admin-nav-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>{getCurrentMenuItem().label}</h1>
          <div className="admin-header-actions">
            <button 
              className="admin-btn admin-btn-secondary"
              onClick={() => navigate('/')}
            >
              🏠 Xem trang khách
            </button>
            <button 
              className="admin-btn admin-btn-danger"
              onClick={handleLogout}
            >
              🚪 Đăng xuất
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
