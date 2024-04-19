// routes/classroomRoutes.js

const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

router.post('/classrooms', classroomController.createClassroom);
router.get('/classrooms', classroomController.getAllClassrooms);
router.get('/classrooms/:id', classroomController.getClassroom);
router.put('/classrooms/:id', classroomController.updateClassroom);
router.put('/classrooms/:classroomId/:userId', classroomController.addLearnerToClassroom);
router.delete('/classrooms/:id', classroomController.deleteClassroom);

module.exports = router;