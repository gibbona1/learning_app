// controllers/levelController.js

const UserLevel = require('../models/userLevel');

exports.getAllLevels = async (req, res) => {
  try {
    const levels = await UserLevel.find();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels', error: error.message });
  }
};

exports.getLevel = async (req, res) => {
  try {
    let query = {};
    if (req.query.levelNumber) {
      query.levelNumber = req.query.levelNumber; // Filter by level if level query param is provided
    }
    const level = await UserLevel.find(query);
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching level', error: error.message });
  }
};