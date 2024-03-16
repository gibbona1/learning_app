// routes/levelRoutes.js

const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');

router.get('/levels', levelController.getAllLevels);
router.get('/levels/:id', levelController.getLevelById);

module.exports = router;
