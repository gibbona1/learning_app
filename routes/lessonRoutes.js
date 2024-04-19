// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// Define the routes for the Item model and map them to controller functions
router.post('/lessons', lessonController.createLesson);
router.get('/lessons', lessonController.getAllLessons);
router.get('/lessons/:id', lessonController.getLesson);
router.delete('/lessons/:id', lessonController.deleteLesson);
router.delete('/lessons/:lessonId/lessonCompleted', lessonController.lessonCompleted);

module.exports = router;
