require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sports Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown Logic for Docker/K8s
const shutdown = (signal) => {
  console.log(`${signal} received. Closing HTTP server...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // Close DB connection if needed, then exit
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));