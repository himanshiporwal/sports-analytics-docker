require('dotenv').config();
const mongoose = require('mongoose');

const Sport = mongoose.model(
  'Sport',
  new mongoose.Schema({
    name: String,
    category: String,
    premium: Boolean
  })
);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Sport.deleteMany(); // optional: clears old data

    await Sport.create([
      { name: "Cricket Analytics", category: "Team", premium: false },
      { name: "Football Heatmap", category: "Team", premium: true }
    ]);

    console.log("✅ Seeded Successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
