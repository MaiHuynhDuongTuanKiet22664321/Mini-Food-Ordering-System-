const pool = require('./src/config/db');

async function addAdminRole() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Update user with ID 1 to have admin role
    await conn.query(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', 1]
    );
    
    console.log('✓ User ID 1 has been updated to admin role');
    
    // Verify the update
    const rows = await conn.query('SELECT id, username, role FROM users WHERE id = ?', [1]);
    if (rows.length > 0) {
      console.log('User details:', rows[0]);
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

addAdminRole();
