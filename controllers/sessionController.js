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

exports.timeOnApp = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId });
    const timeOnApp = sessions.reduce((acc, session) => {
      if (session.endTime) {
        acc += session.endTime - session.startTime;
      } else {
        acc += session.lastActive - session.startTime;
      }
      return acc;
    }, 0);
    res.status(200).json({ timeOnApp });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time on app', error: error.message });
  }
}

exports.getStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId }).sort({ startTime: 'desc' });
    let streak = 0;
    let currentDay = new Date().getDay();
    sessions.forEach(session => {
      const sessionDay = new Date(session.startTime).getDay();
      if (currentDay === sessionDay) {
        streak++;
        currentDay--;
      } else {
        return;
      }
    });
    res.status(200).json({ streak });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching streak', error: error.message });
  }
}