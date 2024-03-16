const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }, // Store hashed passwords, never plaintext
    role: { type: String, enum: ['user', 'teacher', 'learner', 'admin'], required: true },
    registrationDate: { type: Date, default: Date.now },
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;