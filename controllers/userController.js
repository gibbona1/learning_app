// controllers/userController.js

const User = require('../models/user');
const BirdCall = require('../models/birdCall');
const Item = require('../models/item');
const Lesson = require('../models/lesson');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(req.query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Add more methods for update, delete, and get a single user as needed
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.levelUpUser = async (req, res) => {
  const { id: userId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Update the user to the next level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.level += 1; // Increment the level
    await user.save();

    // Step 2: Find all birdCalls with the new level
    const birdCalls = await BirdCall.find({ level: user.level });

    // Step 3 & 4: Create items and lessons for each birdCall
    const itemsPromises = birdCalls.map(birdCall => 
      new Item({ userId, birdCallId: birdCall._id }).save()
    );
    const items = await Promise.all(itemsPromises);

    const lessonsPromises = items.map(item =>
      new Lesson({ userId, itemId: item._id }).save() // Assuming Lesson schema has itemId
    );
    await Promise.all(lessonsPromises);

    res.status(200).json({ message: 'User leveled up and new lessons created', user, items });
  } catch (error) {
    res.status(500).json({ message: 'Error leveling up user', error: error.message });
  }
};
