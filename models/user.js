const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }, // Store hashed passwords, never plaintext
    registrationDate: { type: Date, default: Date.now }
    // Add other fields as needed, e.g., role: { type: String, enum: ['user', 'teacher', 'learner', 'admin'] }
  });
  
const User = mongoose.model('User', userSchema);