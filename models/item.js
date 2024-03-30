const mongoose = require('mongoose');

// Define the activity schema
const ActivitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: Date, required: true }
});

const itemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    birdCallId: { type: mongoose.Schema.Types.ObjectId, ref: 'BirdCall', required: true },
    level: { type: Number, default: 0 }, //this will be apprentice 1-4, guru etc like WaniKani
    lastReviewed: { type: Date, default: Date.now },
    nextReviewDate: { type: Date, default: Date.now()},
    activity: [ActivitySchema]
  });
  
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;