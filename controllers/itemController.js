// controllers/progressController.js

const Item = require('../models/item');

// Create new progress
exports.createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: 'Progress created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error creating progress', error: error.message });
  }
};

// Get all progress records
exports.getAllItems = async (req, res) => {
  try {
    const item = await Item.find();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress records', error: error.message });
  }
};

// Get a single progress record
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

// Update a progress record
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json({ message: 'Progress updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Delete a progress record
exports.deleteProgress = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json({ message: 'Progress deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting progress', error: error.message });
  }
};
