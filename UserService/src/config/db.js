const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'user_service',
  port: 3307,
  connectionLimit: 5
});

module.exports = pool;
