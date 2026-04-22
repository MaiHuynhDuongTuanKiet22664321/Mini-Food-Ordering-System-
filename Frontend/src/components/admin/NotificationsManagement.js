import React, { useState, useEffect } from 'react';
import { getAllNotifications, markNotificationAsRead } from '../../services/api';
import './AdminDashboard.css';

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    type: 'INFO'
  });

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch all notifications for admin view
      const data = await getAllNotifications();
      const notificationsArray = Array.isArray(data) ? data : (data.notifications || []);
      setNotifications(notificationsArray);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement create notification API
      alert('Tính năng tạo thông báo sẽ được thêm sau');
      setShowModal(false);
      setFormData({ message: '', type: 'INFO' });
    } catch (err) {
      setError('Failed to create notification');
      console.error('Error creating notification:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
      // TODO: Implement delete notification API
      alert('Tính năng xóa thông báo sẽ được thêm sau');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'PAYMENT':
        return '💳';
      case 'ORDER':
        return '📦';
      case 'INFO':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  if (loading) {
    return <div className="admin-card">Loading...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2>Quản lý thông báo</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
          ➕ Tạo thông báo mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Nội dung</th>
              <th>Người dùng</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  Không có thông báo nào
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.id}>
                  <td>
                    <span style={{ fontSize: '20px' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                  </td>
                  <td>{notification.message}</td>
                  <td>{notification.user_id}</td>
                  <td>{new Date(notification.created_at).toLocaleString('vi-VN')}</td>
                  <td>
                    <span className={`admin-status-badge ${notification.is_read ? 'admin-status-inactive' : 'admin-status-active'}`}>
                      {notification.is_read ? 'Đã đọc' : 'Chưa đọc'}
                    </span>
                  </td>
                  <td>
                    {!notification.is_read && (
                      <button
                        className="admin-btn admin-btn-success admin-btn-sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        ✓ Đã đọc
                      </button>
                    )}
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Tạo thông báo mới</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateNotification}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Loại thông báo</label>
                  <select
                    className="admin-form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="INFO">ℹ️ Thông tin</option>
                    <option value="PAYMENT">💳 Thanh toán</option>
                    <option value="ORDER">📦 Đơn hàng</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Nội dung thông báo *</label>
                  <textarea
                    className="admin-form-textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập nội dung thông báo..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Gửi tới</label>
                  <select
                    className="admin-form-select"
                  >
                    <option value="all">Tất cả người dùng</option>
                    <option value="1">Người dùng cụ thể</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Gửi thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;
