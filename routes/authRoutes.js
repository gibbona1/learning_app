// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the routes for the Item model and map them to controller functions
router.post('/auth/login', authController.login);

module.exports = router;