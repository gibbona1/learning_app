const mongoose = require('mongoose');
const Item = require('../models/item');

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/myDB';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

async function createItem(userId, birdCallId) {
  try {
    const newItem = new Item({
      userId,
      birdCallId
    });

    // Save the new user to the database
    await newItem.save();
    console.log(`Item created successfully for pair (${userId}, ${birdCallId}).`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Usage
createItem('65f6129443744d5e0adf1236', '65f76f0ce06595e27e28da46');
createItem('65f6129443744d5e0adf1236', '65f76f0ce06595e27e28da47');

