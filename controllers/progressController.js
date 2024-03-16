// controllers/progressController.js

const Progress = require('../models/progress');

// Create new progress
exports.createProgress = async (req, res) => {
  try {
    const progress = new Progress(req.body);
    await progress.save();
    res.status(201).json({ message: 'Progress created successfully', progress });
  } catch (error) {
    res.status(500).json({ message: 'Error creating progress', error: error.message });
  }
};

// Get all progress records
exports.getAllProgress = async (req, res) => {
  try {
    const progresses = await Progress.find();
    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress records', error: error.message });
  }
};

// Get a single progress record
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

// Update a progress record
exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Delete a progress record
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json({ message: 'Progress deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting progress', error: error.message });
  }
};
