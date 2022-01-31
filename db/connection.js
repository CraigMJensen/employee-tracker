const mysql = require('mysql2');
require('dotenv').config();

// Connect to DB
const db = mysql.createConnection({
  host: 'localhost',
  // mysql username
  user: process.env.DB_USER,
  // mysql password
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

module.exports = db;
