const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3004;
const ORDER_SERVICE_URL = 'http://localhost:3003/orders';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST /payments - Process payment
app.post('/payments', async (req, res) => {
  try {
    const { orderId, userId, method } = req.body;

    // Validate input
    if (!orderId || !method) {
      return res.status(400).json({
        success: false,
        message: 'orderId and method are required'
      });
    }

    if (method !== 'COD' && method !== 'BANKING') {
      return res.status(400).json({
        success: false,
        message: 'method must be COD or BANKING'
      });
    }

    // Call Order Service to update status to PAID
    const orderResponse = await axios.patch(`${ORDER_SERVICE_URL}/${orderId}`, {
      status: 'PAID'
    });

    // Log payment success
    console.log(`User đã thanh toán đơn #${orderId} thành công`);

    // Save payment record to database
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO payments (order_id, user_id, method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
        [orderId, userId || 1, method, 'PAID']
      );
      console.log('Payment record saved successfully');

      // Save notification
      await conn.query(
        'INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, ?, NOW())',
        [userId || 1, `Đơn hàng #${orderId} đã thanh toán thành công bằng ${method}`, 'PAYMENT']
      );
      console.log('Notification saved successfully');
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      console.error('Full error details:', dbError);
      throw new Error(`Failed to save payment/notification to database: ${dbError.message}`);
    } finally {
      if (conn) conn.release();
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        orderId,
        method,
        orderStatus: 'PAID'
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error.message);
    
    if (error.response) {
      // Order service returned an error
      return res.status(error.response.status).json({
        success: false,
        message: 'Failed to update order status',
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /payments/:paymentId/status - Get payment status
app.get('/payments/:paymentId/status', async (req, res) => {
  let conn;
  try {
    const { paymentId } = req.params;
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({
      paymentId: rows[0].id,
      orderId: rows[0].order_id,
      method: rows[0].method,
      status: rows[0].status,
      createdAt: rows[0].created_at
    });
  } catch (error) {
    console.error('Error fetching payment status:', error.message);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /notifications/:userId - Get notifications for a user
app.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /notifications - Get all notifications (admin only)
app.get('/notifications', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  } finally {
    if (conn) conn.release();
  }
});

// PATCH /notifications/:notificationId/read - Mark notification as read
app.patch('/notifications/:notificationId/read', async (req, res) => {
  let conn;
  try {
    const { notificationId } = req.params;
    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [notificationId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  } finally {
    if (conn) conn.release();
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Payment Service is running', port: PORT });
});

app.listen(PORT, () => {
  console.log(`Payment Service is running on port ${PORT}`);
});
