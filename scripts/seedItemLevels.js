const mongoose = require('mongoose');
const ItemLevel = require('../models/itemLevel'); // Update the path to where your BirdCall model is located

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/myDB'; // Update with your database name
const BASE_URL = 'https://my-audio-bucket-2024.s3.amazonaws.com/';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

const itemLevels = [{
    num: 1,
    name: 'beginner',
    timeToNext: 5,
},
{
    num: 2,
    name: 'intermediate',
    timeToNext: 15,
},
{
    num: 3,
    name: 'expert',
    timeToNext: 60,
}];

// Function to insert bird calls into the database
const seedDB = async () => {
    await ItemLevel.deleteMany({}); // Optional: Clear the BirdCall collection before inserting
    await ItemLevel.insertMany(itemLevels);
    console.log("Item Levels have been added to the database.");
};

seedDB().then(() => {
    mongoose.connection.close();
});