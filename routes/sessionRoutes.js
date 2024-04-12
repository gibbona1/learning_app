const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

router.post('/sessions', sessionController.createSession);
router.patch('/sessions/:sessionId/lastActive', sessionController.updateLastActive);
router.patch('/sessions/:sessionId/finish', sessionController.finishSession);
router.get('/sessions/:userId/timeOnApp', sessionController.timeOnApp);
router.get('/sessions/:userId/streak', sessionController.getStreak);

module.exports = router;