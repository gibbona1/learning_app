// controllers/itemController.js

const Lesson = require('../models/lesson');
const Item = require('../models/item');
const { getAllDocuments, getDocumentById, deleteDocumentById } = require('../scripts/controllerHelpers');

// Create new Item
exports.createLesson = async (req, res) => {
  try {
    //find lesson with the same itemId and birdCallId
    const lessonExists = await Lesson.findOne({ itemId: req.body.itemId, birdCallId: req.body.birdCallId });
    if (lessonExists) {
      return res.status(400).json({ message: 'Lesson already exists' });
    }
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Lesson', error: error.message });
  }
};

exports.getAllLessons = getAllDocuments(Lesson, 'Lessons');
exports.getLesson = getDocumentById(Lesson, 'Lesson');
exports.deleteLesson = deleteDocumentById(Lesson, 'Lesson');

exports.lessonCompleted = async (req, res) => {
  const { lessonId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Update the user to the next level
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    const now = new Date();
    const item = await Item.findById(lesson.itemId);
    item.level += 1; // Increment the level
    item.nextReviewDate = new Date(now + (60 * 60 * 1000)).setMinutes(0, 0, 0); // Set the next review date to 1 hour from now

    item.activity.push({
      type: 'lesson-complete',
    });
    await item.save();

    // Step 2: delete lesson
    await Lesson.findByIdAndDelete(lessonId);

    res.status(200).json({ message: 'Lesson completed, item upated and lesson deleted', item, lesson });
  } catch (error) {
    res.status(500).json({ message: 'Error completing lesson', error: error.message });
  }
}