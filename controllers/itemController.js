// controllers/itemController.js

const Item = require('../models/item');
const ItemLevel = require('../models/itemLevel');

// Create new Item
exports.createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Item', error: error.message });
  }
};

// Get all Item records
exports.getAllItems = async (req, res) => {
  try {
    const item = await Item.find(req.query);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Item records', error: error.message });
  }
};

// Get a single Item record
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Item', error: error.message });
  }
};

// Update a Item record
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Item', error: error.message });
  }
};

// Delete a Item record
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Item', error: error.message });
  }
};

// level up item if right
exports.levelUpItem = async (req, res) => {
  const { id: itemId } = req.params; // Extract the user ID from the request parameters
  const action = req.query.action || 'increment'; // Default to 'increment' if not specified

  try {
    // Step 1: Update the user to the next level
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (action === 'increment') {
      item.level += 1;
    } else if (action === 'decrement' && item.level > 1) { // Assuming level cannot go below 1
      item.level -= 1;
    }

    const itemLevel = await ItemLevel.findOne({ num: item.level });
    item.nextReviewDate = new Date(Date.now() + (60 * 60 * 1000 * itemLevel.timeToNext)); //this many hours
    await item.save();

    res.status(200).json({ message: 'Item level updated successfully', item });
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating Item level', error: error.message });
  }
};

exports.countReviews = async (req, res) => {
  const { userId, hours } = req.params;
  const numHours = parseInt(hours, 10);

  if (isNaN(numHours)) {
    return res.status(400).json({ message: 'Invalid hours parameter' });
  }

  const now = new Date();
  const targetTime = new Date(now.getTime() + numHours * 60 * 60 * 1000);

  try {
    const count = await Item.countDocuments({
      userId: userId,
      nextReviewDate: { $lte: targetTime }
    });

    res.json({ count });
  } catch (error) {
    console.error('Error counting review items:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};
