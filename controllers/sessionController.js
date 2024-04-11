const Session = require('../models/session');

exports.createSession = async (req, res) => {
  try {
    const { userId } = req.body;
    const session = new Session({ userId });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: 'Could not create session', error: error.message });
  }
};

exports.updateLastActive = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findByIdAndUpdate(sessionId, { lastActive: Date.now() }, { new: true });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: 'Could not update session', error: error.message });
  }
};

exports.finishSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findByIdAndUpdate(sessionId, { endTime: Date.now() }, { new: true });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: 'Could not finish session', error: error.message });
  }
};
