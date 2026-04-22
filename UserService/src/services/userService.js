const pool = require('../config/db');

class UserService {
  async register(name, username, password, role = 'USER') {
    let conn;
    try {
      conn = await pool.getConnection();
      
      const existingUser = await conn.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
      
      if (existingUser.length > 0) {
        throw new Error('Username already exists');
      }

      const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';
      const result = await conn.query(
        'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
        [name, username, password, normalizedRole]
      );

      return { id: Number(result.insertId), name, username, role: normalizedRole };
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async login(username, password) {
    let conn;
    try {
      conn = await pool.getConnection();
      
      const users = await conn.query(
        'SELECT id, name, username, password, role FROM users WHERE username = ? AND password = ?',
        [username, password]
      );

      if (users.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = users[0];
      return { id: Number(user.id), name: user.name, username: user.username, role: user.role };
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async getAllUsers() {
    let conn;
    try {
      conn = await pool.getConnection();
      
      const users = await conn.query(
        'SELECT id, name, username, role, created_at FROM users'
      );

      return users.map(user => ({
        id: Number(user.id),
        name: user.name,
        username: user.username,
        role: user.role,
        created_at: user.created_at
      }));
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async getUserById(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      
      const users = await conn.query(
        'SELECT id, name, username, role, created_at FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        id: Number(user.id),
        name: user.name,
        username: user.username,
        role: user.role,
        created_at: user.created_at
      };
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new UserService();
