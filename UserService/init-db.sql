-- Create database if not exists
CREATE DATABASE IF NOT EXISTS user_service;
USE user_service;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'ADMIN')
ON DUPLICATE KEY UPDATE username=username;
