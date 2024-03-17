const express = require('express');
const router = express.Router();
const itemLevelController = require('../controllers/itemLevelController');

router.get('/itemlevels', itemLevelController.getAllItemLevels);
router.get('/itemlevels/:id', itemLevelController.getItemLevelById);

module.exports = router;