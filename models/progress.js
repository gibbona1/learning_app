const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    birdCallId: { type: mongoose.Schema.Types.ObjectId, ref: 'BirdCall', required: true },
    level: { type: Number, default: 1 }, //this will be apprentice 1-4, guru etc like WaniKani
    lastReviewed: { type: Date, default: Date.now },
    nextReviewDate: { type: Date, required: true }
  });
  
const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;