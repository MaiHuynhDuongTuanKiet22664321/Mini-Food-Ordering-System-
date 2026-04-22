const fs = require('fs');
const pool = require('./config/db');

async function setupDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const sqlContent = fs.readFileSync('./init-db.sql', 'utf8');
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log('Executing database setup...');
    console.log(`Found ${statements.length} SQL statements`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await conn.query(statement);
        console.log(`✓ Statement ${i + 1}: ${statement.substring(0, 60)}...`);
      } catch (err) {
        console.error(`✗ Statement ${i + 1} failed:`, err.message);
      }
    }
    
    // Verify tables exist
    console.log('\nVerifying tables...');
    const tables = await conn.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
    
    console.log('\nDatabase setup completed!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

setupDatabase();
