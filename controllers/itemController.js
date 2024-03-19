// controllers/itemController.js

const Item = require('../models/item');

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
