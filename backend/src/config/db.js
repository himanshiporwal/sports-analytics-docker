const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Do not exit process here; let the orchestration layer handle restarts if needed
    // or handle gracefully depending on requirements.
    // For this demo, we log and proceed, but DB endpoints will fail.
  }
};

module.exports = connectDB;