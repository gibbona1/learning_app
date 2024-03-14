const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    levelNumber: { type: Number, required: true, unique: true },
    description: { type: String },
    unlocksAt: { type: Number } // e.g., total points needed to unlock
  });
  
const Level = mongoose.model('Level', levelSchema);