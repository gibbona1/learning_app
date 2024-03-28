// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Define the routes for the Item model and map them to controller functions
router.post('/items', itemController.createItem);
router.get('/items', itemController.getAllItems);
router.get('/items/:id', itemController.getItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);
router.put('/items/:id/levelup', itemController.levelUpItem);
router.get('/items/:userId/:hours', itemController.dueReviews);
router.get('/items/:userId/:hours/count', itemController.countReviews);
router.get('/itemsgetbyhour/:userId', itemController.upcomingReviewsByHour)


module.exports = router;
