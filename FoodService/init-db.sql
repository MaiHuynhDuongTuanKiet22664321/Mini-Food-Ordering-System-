-- Create database if not exists
CREATE DATABASE IF NOT EXISTS food_service;
USE food_service;

-- Create foods table
CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500)
);
