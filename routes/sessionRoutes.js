const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

router.post('/sessions', sessionController.createSession);
router.patch('/sessions/:sessionId/lastActive', sessionController.updateLastActive);
router.patch('/sessions/:sessionId/finish', sessionController.finishSession);

module.exports = router;