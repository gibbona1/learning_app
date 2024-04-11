const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  lastActive: { type: Date, default: Date.now } // Consider updating this periodically or on beforeunload
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;