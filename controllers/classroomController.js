// controllers/classroomController.js

const Classroom = require('../models/classroom');
const {getAllDocuments, getDocumentById, updateDocumentById, deleteDocumentById} = require('../scripts/controllerHelpers'); 

exports.createClassroom = async (req, res) => {
  try {
    const { name, teacher, learners, description } = req.body;
    const classroom = new Classroom({ name, teacher, learners, description });
    await classroom.save();
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
        const { id: classroomId, userId } = req.params;
        const classroom = await Classroom.findById(classroomId
        );
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        classroom.learners.push(userId);
        await classroom.save();
        res.status(200).json({ message: 'Learner added to classroom successfully', classroom });
    } catch (error) {
        res.status(500).json({ message: 'Error adding learner to classroom', error: error.message });
    }
};
