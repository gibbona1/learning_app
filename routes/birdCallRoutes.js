// routes/birdCallRoutes.js

const express = require('express');
const router = express.Router();
const birdCallController = require('../controllers/birdCallController');

router.get('/birdcalls', birdCallController.getAllBirdCalls);

module.exports = router;
