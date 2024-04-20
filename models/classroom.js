const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: { type: String }
  // Add additional fields as needed, e.g., subject, description, etc.
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;