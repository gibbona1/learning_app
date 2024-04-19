// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:userId/levelUp', userController.levelUpUser);
router.get('/users/:userId/projectLevelUp', userController.projectLevelUp);
router.get('/useractivity24Hour/:userId', userController.activity24Hour);
router.get('/useractivityPerHour/:userId', userController.activityPerHour);
router.get('/userstats/:userId', userController.userStats);

module.exports = router;
