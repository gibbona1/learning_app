const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/myDB';

const saltRounds = 10; // Cost factor for hashing

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

async function createUser(username, email, password, role) {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new User({
      username,
      email,
      passwordHash,
      role
    });

    // Save the new user to the database
    await newUser.save();
    console.log(`User ${username} created successfully with the role of ${role}.`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Usage
createUser('adminUser', 'admin@example.com', 'secureAdminPassword', 'admin');
createUser('learnerUser', 'learner@example.com', 'secureLearnerPassword', 'learner');

