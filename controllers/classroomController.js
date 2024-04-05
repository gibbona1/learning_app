// controllers/classroomController.js

const Classroom = require('../models/classroom');

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

exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find(req.query);
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms', error: error.message });
  }
};

exports.getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classroom', error: error.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json({ message: 'Classroom updated successfully', classroom });
  } catch (error) {
    res.status(500).json({ message: 'Error updating classroom', error: error.message });
  }
};

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

exports.deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting classroom', error: error.message });
  }
};
