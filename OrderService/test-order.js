const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function testOrderCreation() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Create a test order
    const orderId = uuidv4();
    const userId = uuidv4();
    const items = JSON.stringify([
      { id: 1, name: 'Pizza', quantity: 2, price: 15.00 },
      { id: 2, name: 'Burger', quantity: 1, price: 8.50 }
    ]);
    const totalPrice = 38.50;
    const status = 'PENDING';

    console.log('Creating test order...');
    console.log('Order ID:', orderId);
    console.log('User ID:', userId);
    console.log('Items:', items);
    console.log('Total Price:', totalPrice);
    console.log('Status:', status);

    // Insert the order
    await conn.query(
      'INSERT INTO orders (id, user_id, items, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [orderId, userId, items, totalPrice, status]
    );
    console.log('✓ Order inserted successfully');

    // Query the order back
    const rows = await conn.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    console.log('✓ Order retrieved successfully:');
    console.log(JSON.stringify(rows[0], null, 2));

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

testOrderCreation();
