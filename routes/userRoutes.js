// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id/levelUp', userController.levelUpUser);
router.get('/users/:id/projectLevelUp', userController.projectLevelUp);
router.get('/useractivity24Hour/:id', userController.activity24Hour);
router.get('/useractivityPerHour/:id', userController.activityPerHour);
router.get('/userstats/:id', userController.userStats);

module.exports = router;
