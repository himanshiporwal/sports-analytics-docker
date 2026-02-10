const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const sportsRoutes = require('./routes/sports.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic Request Logger (Helpful for container logs)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/', healthRoutes); // Root level health check
app.use('/sports', sportsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;