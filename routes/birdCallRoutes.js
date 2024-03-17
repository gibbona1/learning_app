// routes/birdCallRoutes.js

const express = require('express');
const router = express.Router();
const birdCallController = require('../controllers/birdCallController');

router.get('/birdcalls', birdCallController.getAllBirdCalls);

router.get('/birdcalls/:id', birdCallController.getBirdCallById);

module.exports = router;
