const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const userController = {
  register: async (req, res) => {
    try {
      const { name, username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await userService.register(name, username, password, role);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await userService.login(username, password);
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        'secret',
        { expiresIn: '24h' }
      );

      res.json({ message: 'Login successful', token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;
