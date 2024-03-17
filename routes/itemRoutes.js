// routes/progressRoutes.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Define the routes for the Progress model and map them to controller functions
router.post('/item', itemController.createProgress);
router.get('/item', itemController.getAllProgress);
router.get('/item/:id', itemController.getProgress);
router.put('/item/:id', itemController.updateProgress);
router.delete('/item/:id', itemController.deleteProgress);

module.exports = router;
