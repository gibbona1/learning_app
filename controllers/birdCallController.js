// controllers/birdCallController.js

const BirdCall = require('../models/birdCall');

exports.getAllBirdCalls = async (req, res) => {
  try {
    let query = {};
    if (req.query.level) {
      query.level = req.query.level; // Filter by level if level query param is provided
    }
    const birdCalls = await BirdCall.find(query);
    res.status(200).json(birdCalls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bird calls', error: error.message });
  }
};
