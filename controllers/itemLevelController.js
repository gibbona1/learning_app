const ItemLevel = require('../models/itemLevel');
const {getAllDocuments, getDocumentById} = require('../scripts/controllerHelpers'); 

exports.getAllItemLevels = getAllDocuments(ItemLevel, 'ItemLevels');
exports.getItemLevelById = getDocumentById(ItemLevel, 'ItemLevel');
