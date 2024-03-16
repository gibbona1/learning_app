const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    levelNumber: { type: Number, required: true, unique: true },
    description: { type: String },
  });
  
const Level = mongoose.model('Level', levelSchema);

module.exports = Level;