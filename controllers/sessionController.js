const Session = require('../models/session');

function getLongestStreak(sessions) {
    try {
        let maxStreak = 0;
        let currentStreak = 1;
        let previousDate = null;

        //sort sessions by startTime
        sessions.sort((a, b) => a.startTime - b.startTime);

        sessions.forEach((session, index) => {
            if (index === 0) {
                previousDate = session.startTime;
                return;
            }
            let currentDate = session.startTime;
            let diff = currentDate.getDate() - previousDate.getDate();
            if (diff === 1 || (diff === 0 && currentDate.getDay() !== previousDate.getDay())) {
                currentStreak++;
            } else if (diff > 1) {
                maxStreak = Math.max(maxStreak, currentStreak);
                currentStreak = 1;
            }
            previousDate = currentDate;
        });

        maxStreak = Math.max(maxStreak, currentStreak); // Check at the end of the loop
        return maxStreak;
    } catch (error) {
        console.error('Error calculating the longest streak: ', error);
        return 0;
    }
}


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

    const uniqueSessions = sessions.filter((session, index, self) => {
      return index === self.findIndex((t) => (
        t.startTime.getDate() === session.startTime.getDate() &&
        t.startTime.getMonth() === session.startTime.getMonth() &&
        t.startTime.getFullYear() === session.startTime.getFullYear()
      ));
    });

    let streak = 0;
    // sessions sort newest to oldest
    let currentDate = new Date().getDate();
    uniqueSessions.forEach(session => {
      const sessionDate = new Date(session.startTime).getDate();
      if (currentDate === sessionDate) {
        streak++;
        currentDate--;
      } else {
        return;
      }
    });
    const maxStreak = getLongestStreak(uniqueSessions);
    
    res.status(200).json({ streak: streak, maxStreak: maxStreak});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching streak', error: error.message });
  }
}