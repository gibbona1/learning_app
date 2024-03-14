const mongoose = require('mongoose');
const BirdCall = require('./models/birdCall'); // Update the path to where your BirdCall model is located

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/yourDatabaseName'; // Update with your database name

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

const birdCalls = [
  {
    name: "Northern Cardinal",
    class: "Songbird",
    description: "A cheerful and melodious bird call.",
    audioUrl: "https://example.com/audio/northern-cardinal.mp3",
    level: 1
  },
  // Add more entries as needed
];

// Function to insert bird calls into the database
const seedDB = async () => {
  await BirdCall.deleteMany({}); // Optional: Clear the BirdCall collection before inserting
  await BirdCall.insertMany(birdCalls);
  console.log("Bird calls have been added to the database.");
};

seedDB().then(() => {
  mongoose.connection.close();
});