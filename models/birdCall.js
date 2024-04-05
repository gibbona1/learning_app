const mongoose = require('mongoose');

const birdCallSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true }, // e.g., species, family
    description: { type: String },
    level: { type: Number, required: true }, // Difficulty or progression level
    synonyms: { type: [String] }, // Alternative names
    scientificName: { type: String } // Binomial nomenclature
  });
  
const BirdCall = mongoose.model('BirdCall', birdCallSchema);

module.exports = BirdCall;