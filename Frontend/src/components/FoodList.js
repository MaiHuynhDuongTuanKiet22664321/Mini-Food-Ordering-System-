import React, { useState, useEffect } from 'react';
import { getFoodList } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './FoodList.css';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await getFoodList();
      setFoods(data);
    } catch (err) {
      setError('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    alert(`${food.name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading foods...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="food-list-container">
      <h1>Our Menu</h1>
      <div className="food-grid">
        {foods.map((food) => (
          <div key={food.id} className="food-card">
            <div className="food-image">
              {food.image ? (
                <img src={food.image} alt={food.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="food-info">
              <h3>{food.name}</h3>
              <p className="food-description">{food.description}</p>
              <p className="food-price">${Number(food.price).toFixed(2)}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(food)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;
