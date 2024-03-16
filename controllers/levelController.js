// controllers/levelController.js

const Level = require('../models/level');

exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels', error: error.message });
  }
};

exports.getLevelById = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching level', error: error.message });
  }
};
