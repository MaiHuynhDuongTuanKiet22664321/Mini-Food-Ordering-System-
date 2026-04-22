import React, { useState, useEffect } from 'react';
import { getFoods, getAllUsers, getOrders } from '../../services/api';
import './AdminDashboard.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Poll for stats every 15 seconds
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [foods, users, orders] = await Promise.all([
        getFoods(),
        getAllUsers(),
        getOrders()
      ]);

      console.log('Orders data:', orders);

      // Calculate total revenue from paid orders
      const ordersArray = Array.isArray(orders) ? orders : (orders.orders || []);
      const paidOrders = ordersArray.filter(order => order.status === 'PAID');
      const totalRevenue = paidOrders.reduce((sum, order) => {
        const price = order.totalPrice || order.total_price || 0;
        const numPrice = Number(price) || 0;
        return sum + numPrice;
      }, 0);

      console.log('Paid orders:', paidOrders.length, 'Total revenue:', totalRevenue);

      setStats({
        totalFoods: foods.length,
        totalUsers: Array.isArray(users) ? users.length : (users.users?.length || 0),
        totalOrders: ordersArray.length,
        totalRevenue: totalRevenue
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-card">Loading...</div>;
  }

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ backgroundColor: '#667eea', color: 'white' }}>
            🍔
          </div>
          <div className="admin-stat-info">
            <h4>Tổng món ăn</h4>
            <p>{stats.totalFoods}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ backgroundColor: '#27ae60', color: 'white' }}>
            👥
          </div>
          <div className="admin-stat-info">
            <h4>Tổng người dùng</h4>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ backgroundColor: '#f39c12', color: 'white' }}>
            📦
          </div>
          <div className="admin-stat-info">
            <h4>Tổng đơn hàng</h4>
            <p>{stats.totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
            💰
          </div>
          <div className="admin-stat-info">
            <h4>Doanh thu</h4>
            <p>${Number(stats.totalRevenue || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Chào mừng đến với Admin Dashboard!</h3>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Sử dụng menu bên trái để điều hướng đến các module quản lý.
        </p>
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px', color: '#333' }}>🍔 Quản lý món ăn</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Thêm, sửa, xóa và tìm kiếm món ăn trong hệ thống
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px', color: '#333' }}>👥 Quản lý người dùng</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Xem danh sách, khóa/mở khóa và quản lý tài khoản người dùng
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px', color: '#333' }}>🔔 Quản lý thông báo</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Tạo, xem và quản lý thông báo hệ thống
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
