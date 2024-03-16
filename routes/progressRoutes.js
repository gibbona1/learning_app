// routes/progressRoutes.js

const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Define the routes for the Progress model and map them to controller functions
router.post('/progress', progressController.createProgress);
router.get('/progress', progressController.getAllProgress);
router.get('/progress/:id', progressController.getProgress);
router.put('/progress/:id', progressController.updateProgress);
router.delete('/progress/:id', progressController.deleteProgress);

module.exports = router;
