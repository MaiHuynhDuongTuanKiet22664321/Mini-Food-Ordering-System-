# Food Service API

Node.js Express API for Food Service with MariaDB database.

## Requirements

- Node.js
- MariaDB

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure MariaDB connection in `db.js`:
```javascript
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'food_service',
  connectionLimit: 5
});
```

3. Create database in MariaDB:
```sql
CREATE DATABASE food_service;
```

4. Seed the database with initial data:
```bash
npm run seed
```

This will create the `foods` table and insert 5 initial food items:
- Phở Bò - 45000
- Bún Chả - 40000
- Cơm Tấm - 35000
- Bánh Mì - 25000
- Gỏi Cuốn - 30000

## Run the Server

```bash
npm start
```

The server will run on port 3002.

## API Endpoints

### GET /foods
Get all foods

**Response:**
```json
[
  {
    "id": 1,
    "name": "Phở Bò",
    "price": 45000
  }
]
```

### POST /foods
Create a new food

**Request Body:**
```json
{
  "name": "Cà Phê",
  "price": 20000
}
```

**Response:** Returns the created food with ID

### PUT /foods/:id
Update a food by ID

**Request Body:**
```json
{
  "name": "Cà Phê Sữa",
  "price": 25000
}
```

**Response:** Returns the updated food

### DELETE /foods/:id
Delete a food by ID

**Response:**
```json
{
  "message": "Food deleted successfully"
}
```

## Database Schema

**foods table:**
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- name (VARCHAR(255), NOT NULL)
- price (DECIMAL(10, 2), NOT NULL)
