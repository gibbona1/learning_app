const mongoose = require('mongoose');
const UserLevel = require('../models/userLevel'); // Update the path to where your BirdCall model is located

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/myDB'; // Update with your database name
const BASE_URL = 'https://my-audio-bucket-2024.s3.amazonaws.com/';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

const userLevels = [{
    levelNumber: 1,
    description: 'starter level',
},
{
    levelNumber: 2,
    description: 'next level',
},
{
    levelNumber: 3,
    description: 'next next level',
},
{
    levelNumber: 4,
    description: 'last level (for now)',
}];

// Function to insert bird calls into the database
const seedDB = async () => {
    await UserLevel.deleteMany({}); // Optional: Clear the BirdCall collection before inserting
    await UserLevel.insertMany(userLevels);
    console.log("User Levels have been added to the database.");
};

seedDB().then(() => {
    mongoose.connection.close();
});