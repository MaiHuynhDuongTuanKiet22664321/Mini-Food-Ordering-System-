const pool = require('./src/config/db');

async function addNameColumn() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('Adding name column to users table...');
    
    // Check if column exists
    const columns = await conn.query('SHOW COLUMNS FROM users');
    const hasNameColumn = columns.some(col => col.Field === 'name');
    
    if (hasNameColumn) {
      console.log('✓ Name column already exists');
    } else {
      await conn.query('ALTER TABLE users ADD COLUMN name VARCHAR(100) AFTER id');
      console.log('✓ Name column added successfully');
    }
    
    // Update existing admin user with a name
    await conn.query(
      'UPDATE users SET name = ? WHERE username = ?',
      ['Admin', 'admin']
    );
    console.log('✓ Admin user name updated');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

addNameColumn();
