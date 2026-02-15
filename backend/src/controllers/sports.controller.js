const mongoose = require("mongoose");
const Sport = require("../models/Sport");

// GET /api/sports  (Static Data)
const getStaticSports = (req, res) => {
  const staticData = [
    { name: "Cricket", players: 11 },
    { name: "Football", players: 11 },
    { name: "Basketball", players: 5 },
    { name: "Tennis", players: 1 },
    { name: "Volleyball", players: 6 },
  ];
  return res.json(staticData);
};

// GET /api/sports/db  (Mongo Data)
const getDbSports = async (req, res) => {
  try {
    // Ensure DB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }

    // Auto-seed if empty (demo helper)
    const count = await Sport.countDocuments();
    if (count === 0) {
      console.log("Seeding database with initial data...");

      // Use upsert to avoid unique key errors if seed runs again
      const seed = [
        { name: "Cricket Analytics", players: 11 },
        { name: "Football Heatmap", players: 11 },
        { name: "Basketball Insights", players: 5 },
      ];

      await Promise.all(
        seed.map((s) =>
          Sport.updateOne(
            { name: s.name },
            { $setOnInsert: s },
            { upsert: true }
          )
        )
      );
    }

    const sports = await Sport.find({}).sort({ name: 1 }).lean();
    return res.json(sports);
  } catch (error) {
    console.error("Database fetch error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getStaticSports, getDbSports };
