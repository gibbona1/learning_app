// controllers/itemController.js

const Lesson = require('../models/lesson');

// Create new Item
exports.createLesson = async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Lesson', error: error.message });
  }
};

// Get all Item records
exports.getAllLessons = async (req, res) => {
  try {
    const lesson = await Lesson.find(req.query);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Lesson records', error: error.message });
  }
};

// Get a single Item record
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Lesson', error: error.message });
  }
};

// Delete a Item record
exports.deleteItem = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Lesson', error: error.message });
  }
};
