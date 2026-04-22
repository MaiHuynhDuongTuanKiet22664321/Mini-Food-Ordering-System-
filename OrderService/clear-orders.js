const pool = require('./config/db');

async function clearOrders() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('Clearing orders table...');
    await conn.query('DELETE FROM orders');
    console.log('✓ Orders table cleared');
    
    const count = await conn.query('SELECT COUNT(*) as count FROM orders');
    console.log(`Current orders count: ${count[0].count}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

clearOrders();
