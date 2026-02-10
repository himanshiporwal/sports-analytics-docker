const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  players: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Sport', sportSchema);