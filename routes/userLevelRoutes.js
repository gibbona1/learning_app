// routes/levelRoutes.js

const express = require('express');
const router = express.Router();
const userLevelController = require('../controllers/userLevelController');

router.get('/userlevels', userLevelController.getAllUserLevels);
router.get('/userlevels/:id', userLevelController.getUserLevelById);

module.exports = router;
