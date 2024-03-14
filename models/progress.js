const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    birdCallId: { type: mongoose.Schema.Types.ObjectId, ref: 'BirdCall', required: true },
    level: { type: Number, default: 0 },
    lastReviewed: { type: Date, default: Date.now },
    nextReviewDate: { type: Date, required: true }
  });
  
const Progress = mongoose.model('Progress', progressSchema);