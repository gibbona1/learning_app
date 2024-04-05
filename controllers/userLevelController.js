const UserLevel = require('../models/userLevel');
const { getAllDocuments, getDocumentById } = require('../scripts/controllerHelpers');

exports.getAllUserLevels = getAllDocuments(UserLevel, 'UserLevels');
exports.getUserLevelById = getDocumentById(UserLevel, 'UserLevel');
