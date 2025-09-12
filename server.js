// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Enable CORS
const { connectToDb } = require('./db/connection');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger/swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON & form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health route (handy for Render)
app.get('/', (_req, res) => {
  res.send('Contacts API is running. See /api-docs for Swagger UI.');
});

// Contacts routes
app.use('/contacts', require('./routes/contacts'));

// Serve raw OpenAPI spec (optional but useful)
app.get('/swagger.json', (_req, res) => res.json(swaggerDoc));

// Swagger UI (required by assignment)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server after DB connects
connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Swagger UI: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
