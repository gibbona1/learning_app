const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    birdCallId: { type: mongoose.Schema.Types.ObjectId, ref: 'BirdCall', required: true },
    level: { type: Number, default: 0 }, //this will be apprentice 1-4, guru etc like WaniKani
    lastReviewed: { type: Date, default: Date.now },
    nextReviewDate: { type: Date, default: Date.now()}
  });
  
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;