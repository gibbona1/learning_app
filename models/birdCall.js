const mongoose = require('mongoose');

const birdCallSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true }, // e.g., species, family
    description: { type: String },
    audioUrl: { type: String, required: true }, // URL to the audio file
    level: { type: Number, required: true } // Difficulty or progression level
  });
  
const BirdCall = mongoose.model('BirdCall', birdCallSchema);

module.exports = BirdCall;