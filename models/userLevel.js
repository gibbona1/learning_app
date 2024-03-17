const mongoose = require('mongoose');

const userLevelSchema = new mongoose.Schema({
    levelNumber: { type: Number, required: true, unique: true },
    description: { type: String },
    // condition to pass e.g. 80% of previous level to certiain level. may be standard across levels
  });
  
const UserLevel = mongoose.model('UserLevel', userLevelSchema);

module.exports = UserLevel;