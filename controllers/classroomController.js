// controllers/classroomController.js

const Classroom = require('../models/classroom');
const User = require('../models/user');
const {getAllDocuments, getDocumentById, updateDocumentById, deleteDocumentById} = require('../scripts/controllerHelpers'); 

exports.createClassroom = async (req, res) => {
  try {
    const { name, teacher, learners, description } = req.body;
    //make sure each learner exists in Users
    const learnersExist = await User.find({ _id: { $in: learners } });
    if (learnersExist.length !== learners.length) {
        return res.status(400).json({ message: 'One or more learners do not exist' });
    }
    //make sure teacher exists in Users
    const teacherExist = await User.findById(teacher);
    if (!teacherExist) {
        return res.status(400).json({ message: 'Teacher does not exist' });
    }

    const classroom = new Classroom({ name, teacher, learners, description });
    await classroom.save();

    //add classroom id to teacher's classrooms array
    teacherExist.classrooms.push(classroom._id);
    await teacherExist.save();

    //add classroom id to each learner's classrooms array
    learnersExist.forEach(async learner => {
        learner.classrooms.push(classroom._id);
        await learner.save();
    });
    res.status(201).json({ message: 'Classroom created successfully', classroom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating classroom', error: error.message });
  }
};

exports.getAllClassrooms = getAllDocuments(Classroom, 'Classrooms');
exports.getClassroom = getDocumentById(Classroom, 'Classroom');
exports.updateClassroom = updateDocumentById(Classroom, 'Classroom');
exports.deleteClassroom = deleteDocumentById(Classroom, 'Classroom');

exports.addLearnerToClassroom = async (req, res) => {
    try {
        const { classroomId, userId } = req.params;
        const { action = 'add' } = req.query;

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        if (action === 'add') {
            if (classroom.learners.includes(userId)) {
                return res.status(400).json({ message: 'Learner already in classroom' });
            }
            classroom.learners.push(userId);
        } else if (action === 'remove') {
            if (!classroom.learners.includes(userId)) {
                return res.status(400).json({ message: 'Learner not in classroom' });
            }
            classroom.learners = classroom.learners.filter(learner => learner.toString() !== userId);
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        await classroom.save();

        const user = await User.findById(userId);
        user.classrooms.push(classroomId);
        await user.save();
        res.status(200).json({ message: `${action} completed successfully to user for classroom`, classroom });
    } catch (error) {
        res.status(500).json({ message: 'Error adding learner to classroom', error: error.message });
    }
};
