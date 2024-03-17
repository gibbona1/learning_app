const mongoose = require('mongoose');

const itemLevelSchema = new mongoose.Schema({
    num: { type: Number, required: true },
    name: { type: String, required: true },
    timeToNext: { type: Number, required: true }, // in minutes
  });
  
const ItemLevel = mongoose.model('ItemLevel', itemLevelSchema);

module.exports = ItemLevel;