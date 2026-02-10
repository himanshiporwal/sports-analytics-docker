const Sport = require('../models/Sport');

// Static Data for /sports
const getStaticSports = (req, res) => {
  const staticData = [
    { name: "Cricket", players: 11 },
    { name: "Football", players: 11 },
    { name: "Basketball", players: 5 },
    { name: "Tennis", players: 1 },
    { name: "Volleyball", players: 6 }
  ];
  res.json(staticData);
};

// Database Data for /sports/db
const getDbSports = async (req, res) => {
  try {
    // Check if connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    // Auto-seed if empty (Helper logic for DevOps demos)
    const count = await Sport.countDocuments();
    if (count === 0) {
      console.log('Seeding database with initial data...');
      await Sport.insertMany([
        { name: "Rugby", players: 15 },
        { name: "Baseball", players: 9 },
        { name: "Ice Hockey", players: 6 }
      ]);
    }

    const sports = await Sport.find({});
    res.json(sports);
  } catch (error) {
    console.error('Database fetch error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const mongoose = require('mongoose');

module.exports = {
  getStaticSports,
  getDbSports
};