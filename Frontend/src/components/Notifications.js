import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationAsRead } from '../services/api';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const MAX_CONSECUTIVE_ERRORS = 3;

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Poll for notifications every 10 seconds
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) {
      console.warn('User ID is not available');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
      setConsecutiveErrors(0); // Reset error counter on success
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
      setConsecutiveErrors(prev => prev + 1);
      
      // Stop polling after MAX_CONSECUTIVE_ERRORS
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        console.warn('Stopping polling due to consecutive errors');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update state AFTER API success
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(n.id))
      );
      // Update state after all API calls succeed
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="notifications-container">
      <button 
        className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Thông báo'}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Thông báo {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}</h3>
            <div className="header-buttons">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read-btn"
                  onClick={handleMarkAllAsRead}
                  title="Đánh dấu tất cả đã đọc"
                >
                  Đọc tất cả
                </button>
              )}
              <button className="close-btn" onClick={() => setIsOpen(false)} title="Đóng">✕</button>
            </div>
          </div>
          <div className="notifications-list">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Đang tải...</p>
              </div>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notifications-icon">📭</span>
                <p>Không có thông báo</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <span className="notification-type-icon">{getNotificationIcon(notification.type)}</span>
                    <div className="notification-text">
                      <p>{notification.message}</p>
                      <small>{formatTimeAgo(notification.created_at)}</small>
                    </div>
                    {!notification.is_read && <span className="unread-dot"></span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
