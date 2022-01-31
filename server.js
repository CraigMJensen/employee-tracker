const express = require('express');
const inquirer = require('inquirer');

const cTable = require('console.table');

const db = require('./db/connection');

const app = express();

const PORT = process.env.PORT || 3001;

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected.');
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
