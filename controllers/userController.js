// controllers/userController.js

const User = require('../models/user');
const BirdCall = require('../models/birdCall');
const Item = require('../models/item');
const Lesson = require('../models/lesson');
const UserLevel = require('../models/userLevel');
const bcrypt = require('bcrypt');
const { getAllDocuments, getDocumentById, updateDocumentById, deleteDocumentById } = require('../scripts/controllerHelpers');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash, role });
    user.levelData.push({ level: 0, startDate: user.registrationDate });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.getAllUsers = getAllDocuments(User, 'User');
exports.getUser = getDocumentById(User, 'User');
exports.updateUser = updateDocumentById(User, 'User');
exports.deleteUser = deleteDocumentById(User, 'User');

exports.levelUpUser = async (req, res) => {
  const { id: userId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Update the user to the next level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const maxUserLevel = await UserLevel.find().sort({ levelNumber: -1 }).limit(1);
    const maxLevel = maxUserLevel[0].levelNumber; // Extracting the num field from the max item level document

    now = new Date();
    // Check if the levelData array is long enough and the specific entry exists

    if (user.levelData[user.level]) {
      //if endDate exists, then the level is already completed
      if (typeof (user.levelData[user.level].endDate) !== 'undefined') {
        if (user.level >= maxLevel) {
          // Item is already at or above the maximum level, can't increment
          return res.status(400).json({ message: "Can't level up user, already completed max level" });
        }
      }
      user.levelData[user.level].endDate = now; // Safely set endDate
      if (user.level == maxLevel) {
        // Item is already at or above the maximum level, can't increment
        await user.save();
        return res.status(200).json({ message: "Finished max level", user });
      }
    } else {
      // The levelData array does not have an entry for the current level
      return res.status(500).json('Level data array doesn\'t exist');
    }

    user.level += 1; // Increment the level

    // Append new level data
    user.levelData.push({
      level: user.level,
      startDate: now // Current date/time
    });

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

exports.projectLevelUp = async (req, res) => {
  const { id: userId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Update the user to the next level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    now = new Date();

    if ((user?.levelData ?? null) === null) {
      return res.status(201).json({ message: 'User level data not found. possibly old user' });
    }

    if ((user.levelData[user.level]?.startDate ?? null) === null){
      return res.status(201).json({ message: 'User level start date not found. possibly old user' });
    }

    // check if last user levelData is completed
    if (user.levelData[user.level]?.endDate) {
      return res.status(201).json({ message: "Last level data is completed" });
    }

    //get all leveldata except last
    let levelData = user.levelData.slice(0, -1);

    const durationData = levelData.map(level => ({
      level: level.level,
      // Use endDate if it exists; otherwise, use current date/time
      duration: (new Date(level.endDate) - new Date(level.startDate)) / (1000 * 60 * 60 * 24) // Convert to days
    }));

    //get average of all levelData durations except the last
    let avg = durationData.reduce((sum, current) => sum + current.duration, 0) / durationData.length;

    //now get time from last item's startdate and now
    let duration = (now - user.levelData[user.level].startDate) / (1000 * 60 * 60 * 24); // Convert to days

    // if duration is more than average, set proj to 0, else set to average - duration
    let projection = duration > avg ? 0 : avg - duration;

    res.status(200).json({ projection: projection, duration: duration });

  } catch (error) {
    res.status(500).json({ message: 'Error projecting levelup for user', error: error.message });
  }
}

exports.activity24Hour = async (req, res) => {
  const { id: userId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Get all items for the user
    const items = await Item.find({
      userId: userId,
      activity: { $exists: true, $ne: [] }
    });

    const activityData = items.flatMap(item => {
      return item.activity.map(activity => {
        return { id: item._id, ...activity };
      });
    });
    const now = new Date();

    // Calculate the time 24 hours ago
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Initialize an object to store counts for each type
    let typeCounts = {};

    // Iterate through each item
    activityData.forEach(item => {
      // Iterate through each activity
      Object.values(item)
        .filter(obj => typeof obj === 'object')
        .filter(obj => new Date(obj.date) >= yesterday)
        .forEach(activityObj => {
          // Check if the date is within the last 24 hours

          const type = activityObj.type;
          if (typeCounts[type]) {
            typeCounts[type]++;
          } else {
            typeCounts[type] = 1;
          }
        });
    });

    res.status(200).json(typeCounts);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity data for user', error: error.message });
  }
}

exports.userStats = async (req, res) => {
  const { id: userId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Get all items for the user
    const items = await Item.find({
      userId: userId,
      activity: { $exists: true, $ne: [] }
    });

    const activityData = items.flatMap(item => {
      return item.activity.map(activity => {
        return { id: item._id, ...activity };
      });
    });
    const counters = {
      'lesson-complete': 0,
      reset: 0,
      'level-up': 0, // levelup or complete
      'level-down': 0, // leveldown
      complete: 0
    };
    activityData.forEach(item => {
      // Iterate through each activity
      Object.values(item)
        .filter(obj => typeof obj === 'object')
        .forEach(activity => {
          switch (activity.type) {
            case 'lesson-complete':
            case 'reset':
            case 'level-up':
            case 'complete':
            case 'level-down':
              counters[activity.type]++;
              break;
            default:
              break;
          }
        })
    });

    res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
}

exports.activityPerHour = async (req, res) => {
  const { userId } = req.params;

  const items = await Item.find({
    userId: userId,
    activity: { $exists: true, $ne: [] }
  });

  try { 
    let countsByHour = [];

    for (let hour = 0; hour <= 24; hour++) {
      const counters = {
        'lesson-complete': 0,
        reset: 0,
        'level-up': 0, // levelup or complete
        'level-down': 0, // leveldown
        complete: 0
      };

      countsByHour.push(counters);
    }

    items.map(item => {
      // Iterate through each activity of the current item
      item.activity.forEach(activity => {
        //get hour of item.date
        let hour = new Date(activity.date).getHours();
        countsByHour[hour][activity.type]++;
      });
    });

    res.json(countsByHour);
  } catch (error) {
    console.error('Error counting review items by hour:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
}