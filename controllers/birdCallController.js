// controllers/birdCallController.js

const BirdCall = require('../models/birdCall');
const { getDocumentById, getAllDocuments } = require('../scripts/controllerHelpers');

exports.getAllBirdCalls = getAllDocuments(BirdCall, 'BirdCalls');
exports.getBirdCallById = getDocumentById(BirdCall, 'BirdCall');
