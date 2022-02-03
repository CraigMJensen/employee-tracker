const db = require('./db/connection');

const connected = require('./prompts');

db.connect((err) => {
  if (err) throw err;
  console.info('Database connected.');
  connected();
});
