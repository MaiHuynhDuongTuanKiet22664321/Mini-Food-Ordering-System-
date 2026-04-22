import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/api';
import './AdminDashboard.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    // Poll for users every 10 seconds
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      // Handle both array and object with users property
      const usersArray = Array.isArray(data) ? data : (data.users || []);
      setUsers(usersArray);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleLockUser = (userId) => {
    // TODO: Implement lock user API
    alert('Tính năng khóa tài khoản sẽ được thêm sau');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      // TODO: Implement delete user API
      alert('Tính năng xóa người dùng sẽ được thêm sau');
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) {
    return <div className="admin-card">Loading...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2>Quản lý người dùng</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-search">
        <input
          type="text"
          className="admin-search-input"
          placeholder="🔍 Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="admin-filter-select"
          value={roleFilter}
          onChange={handleRoleFilter}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>
                    <span className={`admin-role-badge admin-role-${user.role?.toLowerCase() || 'user'}`}>
                      {user.role || 'User'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className="admin-status-badge admin-status-active">
                      Hoạt động
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleViewDetails(user)}
                    >
                      👁️ Chi tiết
                    </button>
                    <button
                      className="admin-btn admin-btn-warning admin-btn-sm"
                      onClick={() => handleLockUser(user.id)}
                    >
                      🔒 Khóa
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
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

      {showModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Chi tiết người dùng</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>ID:</label>
                <p>{selectedUser.id}</p>
              </div>
              <div className="admin-form-group">
                <label>Username:</label>
                <p>{selectedUser.username}</p>
              </div>
              <div className="admin-form-group">
                <label>Vai trò:</label>
                <p>{selectedUser.role || 'User'}</p>
              </div>
              <div className="admin-form-group">
                <label>Ngày tạo:</label>
                <p>{new Date(selectedUser.created_at).toLocaleString('vi-VN')}</p>
              </div>
              <div className="admin-form-group">
                <label>Trạng thái:</label>
                <span className="admin-status-badge admin-status-active">
                  Hoạt động
                </span>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
