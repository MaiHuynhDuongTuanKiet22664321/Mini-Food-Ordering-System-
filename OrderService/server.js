const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const pool = require('./config/db');
const logger = require('./logger');

const app = express();
const PORT = 3003;

// Configure retry for axios
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response?.status >= 500 || error.code === 'ECONNREFUSED';
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(`Retrying request to ${requestConfig.url} - attempt ${retryCount}`);
  }
});

app.use(cors());
app.use(express.json());

// POST /orders - Create a new order
app.post('/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;

    logger.info('Creating new order', { userId, itemCount: items.length });

    // Validate input
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      logger.warn('Invalid order request', { userId, items });
      return res.status(400).json({ error: 'userId and items array are required' });
    }

    // Check if user exists by calling User Service
    let userResponse;
    try {
      userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
      logger.info('User validated successfully', { userId });
    } catch (error) {
      logger.error('User validation failed', { userId, error: error.message });
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'User not found' });
      }
      throw error;
    }
    if (!userResponse.data) {
      logger.warn('User not found', { userId });
      return res.status(404).json({ error: 'User not found' });
    }

    // Get food prices by calling Food Service
    let foodResponse;
    try {
      foodResponse = await axios.get('http://localhost:3002/foods');
      logger.info('Food data fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch food data', { error: error.message });
      return res.status(500).json({ error: 'Failed to fetch food data' });
    }
    const foods = foodResponse.data;
    if (!Array.isArray(foods)) {
      logger.error('Invalid food data format');
      return res.status(500).json({ error: 'Invalid food data format' });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const food = foods.find(f => f.id === item.foodId);
      if (!food) {
        logger.warn('Food not found', { foodId: item.foodId });
        return res.status(404).json({ error: `Food with id ${item.foodId} not found` });
      }
      totalPrice += food.price * item.quantity;
    }

    // Create new order
    const orderId = uuidv4();
    const order = {
      id: orderId,
      userId,
      items: JSON.stringify(items),
      totalPrice,
      status: 'PENDING'
    };

    // Save order to database
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO orders (id, user_id, items, total_price, status) VALUES (?, ?, ?, ?, ?)',
        [order.id, order.userId, order.items, order.totalPrice, order.status]
      );
      logger.info('Order created successfully', { orderId, userId, totalPrice });
    } catch (dbError) {
      logger.error('Database error', { error: dbError.message });
      return res.status(500).json({ error: 'Failed to save order to database' });
    } finally {
      if (conn) conn.release();
    }

    res.status(201).json({
      id: order.id,
      userId: order.userId,
      items: JSON.parse(order.items),
      totalPrice: order.totalPrice,
      status: order.status
    });
  } catch (error) {
    logger.error('Error creating order', { error: error.message });
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'User or Food not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /orders - Get all orders
app.get('/orders', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM orders');
    const orders = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      items: JSON.parse(row.items),
      totalPrice: row.total_price,
      status: row.status,
      createdAt: row.created_at
    }));
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders from database' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /orders/:id - Get order by ID
app.get('/orders/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = {
      id: rows[0].id,
      userId: rows[0].user_id,
      items: JSON.parse(rows[0].items),
      totalPrice: rows[0].total_price,
      status: rows[0].status,
      createdAt: rows[0].created_at
    };
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ error: 'Failed to fetch order from database' });
  } finally {
    if (conn) conn.release();
  }
});

// PATCH /orders/:id - Update order status
app.patch('/orders/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const rows = await conn.query('SELECT * FROM orders WHERE id = ?', [id]);
    const order = {
      id: rows[0].id,
      userId: rows[0].user_id,
      items: JSON.parse(rows[0].items),
      totalPrice: rows[0].total_price,
      status: rows[0].status,
      createdAt: rows[0].created_at
    };
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ error: 'Failed to update order in database' });
  } finally {
    if (conn) conn.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
