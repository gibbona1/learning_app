const mongoose = require('mongoose');

// Define the LevelData schema
const LevelDataSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date } // Optional
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }, // Store hashed passwords, never plaintext
    role: { type: String, enum: ['user', 'teacher', 'learner', 'admin'], required: true },
    registrationDate: { type: Date, default: Date.now },
    level: { type: Number, default: 0 }, //user level
    levelData: [LevelDataSchema], //user level data
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;