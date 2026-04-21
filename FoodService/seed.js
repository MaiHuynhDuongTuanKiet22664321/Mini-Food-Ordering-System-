const pool = require('./db');

async function seedDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Drop table if exists
    await conn.query('DROP TABLE IF EXISTS foods');
    
    // Create foods table with image column
    await conn.query(`
      CREATE TABLE foods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500)
      )
    `);
    
    // Seed 5 food items with image URLs
    const foods = [
      { 
        name: 'Phở Bò', 
        price: 45000, 
        image: 'https://images.unsplash.com/photo-1583224944169-7113ce7c6a7f?w=400&h=300&fit=crop' 
      },
      { 
        name: 'Bún Chả', 
        price: 40000, 
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop' 
      },
      { 
        name: 'Cơm Tấm', 
        price: 35000, 
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' 
      },
      { 
        name: 'Bánh Mì', 
        price: 25000, 
        image: 'https://images.unsplash.com/photo-1582951447938-9270799e6b26?w=400&h=300&fit=crop' 
      },
      { 
        name: 'Gỏi Cuốn', 
        price: 30000, 
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' 
      }
    ];
    
    for (const food of foods) {
      await conn.query('INSERT INTO foods (name, price, image) VALUES (?, ?, ?)', [food.name, food.price, food.image]);
    }
    
    console.log('Database seeded successfully with 5 food items!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}

seedDatabase();
