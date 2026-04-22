import React, { useState, useEffect } from 'react';
import { getFoods, addFood, updateFood, deleteFood } from '../../services/api';
import './AdminDashboard.css';

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await getFoods();
      setFoods(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch foods');
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingFood(null);
    setFormData({ name: '', price: '', image: '' });
    setShowModal(true);
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      price: food.price,
      image: food.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      try {
        await deleteFood(id);
        await fetchFoods();
      } catch (err) {
        setError('Failed to delete food');
        console.error('Error deleting food:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const foodData = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image
      };

      if (editingFood) {
        await updateFood(editingFood.id, foodData);
      } else {
        await addFood(foodData);
      }

      await fetchFoods();
      setShowModal(false);
      setFormData({ name: '', price: '', image: '' });
      setEditingFood(null);
    } catch (err) {
      setError(editingFood ? 'Failed to update food' : 'Failed to add food');
      console.error('Error saving food:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="admin-card">Loading...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2>Quản lý món ăn</h2>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
          ➕ Thêm món mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-search">
        <input
          type="text"
          className="admin-search-input"
          placeholder="🔍 Tìm kiếm món ăn..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên món ăn</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                  Không tìm thấy món ăn nào
                </td>
              </tr>
            ) : (
              filteredFoods.map((food) => (
                <tr key={food.id}>
                  <td>
                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🍽️
                      </div>
                    )}
                  </td>
                  <td>{food.name}</td>
                  <td>${Number(food.price).toFixed(2)}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleEdit(food)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDelete(food.id)}
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
              <h3>{editingFood ? 'Sửa món ăn' : 'Thêm món mới'}</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Tên món ăn *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Giá ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="admin-form-input"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>URL hình ảnh</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/food.jpg"
                  />
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
                  {editingFood ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;
