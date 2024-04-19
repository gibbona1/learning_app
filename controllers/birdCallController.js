// controllers/birdCallController.js

const BirdCall = require('../models/birdCall');
const { getDocumentById } = require('../scripts/controllerHelpers');

exports.getAllBirdCalls = async (req, res) => {
  try {
    // Extract query parameters
    const { level, class: birdClass } = req.query;
    let query = {};

    if (level) {
      query.level = level;
    }

    if (birdClass) {
      query.class = birdClass;
    }

    const birdCalls = await BirdCall.find(query);
    res.status(200).json(birdCalls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bird calls', error: error.message });
  }
};

exports.getBirdCallById = getDocumentById(BirdCall, 'BirdCall');
