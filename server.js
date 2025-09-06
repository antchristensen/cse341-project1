const express = require('express');
require('dotenv').config();
const { connectToDb } = require('./db/connection');

const app = express();
const port = process.env.PORT || 3000;

// health route
app.get('/', (_req, res) => res.send('Hello World'));

// mount contacts routes
const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

// start server after DB connects
connectToDb()
  .then(() => {
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('DB connect failed:', err);
    process.exit(1);
  });
