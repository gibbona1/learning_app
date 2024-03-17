// routes/ItemRoutes.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Define the routes for the Item model and map them to controller functions
router.post('/item', itemController.createItem);
router.get('/item', itemController.getAllItems);
router.get('/item/:id', itemController.getItem);
router.put('/item/:id', itemController.updateItem);
router.delete('/item/:id', itemController.deleteItem);

module.exports = router;
