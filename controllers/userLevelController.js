// controllers/levelController.js

const UserLevel = require('../models/userLevel');

exports.getAllUserLevels = async (req, res) => {
  try {
    const levels = await UserLevel.find(req.query);
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels', error: error.message });
  }
};

exports.getUserLevelById = async (req, res) => {
  try {
    const level = await UserLevel.findById(req.params.id);
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching level', error: error.message });
  }
};
