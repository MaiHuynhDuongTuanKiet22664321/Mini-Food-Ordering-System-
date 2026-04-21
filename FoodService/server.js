const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET /foods - Get all foods
app.get('/foods', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM foods');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching foods:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /foods/:id - Get food by ID
app.get('/foods/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching food:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// POST /foods - Create a new food
app.post('/foods', async (req, res) => {
  let conn;
  try {
    const { name, price, image } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO foods (name, price, image) VALUES (?, ?, ?)', [name, price, image || null]);
    const newFood = await conn.query('SELECT * FROM foods WHERE id = ?', [result.insertId]);
    res.status(201).json(newFood[0]);
  } catch (err) {
    console.error('Error creating food:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// PUT /foods/:id - Update a food
app.put('/foods/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { name, price, image } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    conn = await pool.getConnection();
    const result = await conn.query('UPDATE foods SET name = ?, price = ?, image = ? WHERE id = ?', [name, price, image, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    const updatedFood = await conn.query('SELECT * FROM foods WHERE id = ?', [id]);
    res.json(updatedFood[0]);
  } catch (err) {
    console.error('Error updating food:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE /foods/:id - Delete a food
app.delete('/foods/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    
    conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM foods WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    console.error('Error deleting food:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Food Service API running on port ${PORT}`);
});
