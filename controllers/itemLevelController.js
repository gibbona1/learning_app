const ItemLevel = require('../models/itemLevel');

exports.getAllItemLevels = async (req, res) => {
  try {
    const levels = await ItemLevel.find(req.query);
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels', error: error.message });
  }
};

exports.getItemLevelById = async (req, res) => {
  try {
    const level = await ItemLevel.findById(req.params.id);
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching level', error: error.message });
  }
};
