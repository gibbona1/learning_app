// routes/levelRoutes.js

const express = require('express');
const router = express.Router();
const userLevelController = require('../controllers/userLevelController');

router.get('/levels', userLevelController.getAllLevels);
router.get('/levels/:levelNumber', userLevelController.getLevel);

module.exports = router;
