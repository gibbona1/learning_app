// controllers/itemController.js

const Lesson = require('../models/lesson');
const Item = require('../models/item');

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
exports.deleteLesson = async (req, res) => {
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

exports.lessonCompleted = async (req, res) => {
  const { id: lessonId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Update the user to the next level
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const item = await Item.findById(lesson.itemId);
    item.level += 1; // Increment the level
    item.nextReviewDate =  new Date(Date.now() + (60 * 60 * 1000)).setMinutes(0, 0, 0); // Set the next review date to 1 hour from now
    await item.save();

    // Step 2: delete lesson
    await Lesson.findByIdAndDelete(lessonId);

    res.status(200).json({ message: 'Lesson completed, item upated and lesson deleted', item, lesson });
  } catch (error) {
    res.status(500).json({ message: 'Error completing lesson', error: error.message });
  }
}