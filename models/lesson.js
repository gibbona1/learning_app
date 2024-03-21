const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    createdDate: { type: Date, default: Date.now },
  });
  
const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;