// controllers/itemController.js

const Item = require('../models/item');
const ItemLevel = require('../models/itemLevel');
const Lesson = require('../models/lesson');

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
  const { action: action } = req.body || 'increment'; // Default to 'increment' if not specified

  try {
    // Step 1: Update the user to the next level
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const now = new Date();

    const maxItemLevel = await ItemLevel.find().sort({ num: -1 }).limit(1);
    const maxLevel = maxItemLevel[0].num; // Extracting the num field from the max item level document

    if (action === 'increment') {
      if (item.level >= maxLevel) {
        // Item is already at or above the maximum level, can't increment
        return res.status(400).json({ message: "Can't level up item, already at max level" });
      }
      item.level += 1;
    } else if (action === 'decrement') { // Assuming level cannot go below 1
      if (item.level <= 1) {
        // Item is already at or below the minimum level, can't decrement
        return res.status(400).json({ message: "Can't level down item, already at min level" });
      }
      item.level -= 1;
    } else if (action === 'reset') {
      //do reset
      item.level = 0;
      const lesson = new Lesson({ userId: item.userId, itemId: itemId });
      await lesson.save();
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    let activity;
    if (action === 'increment') {
      activity = 'level-up';
    } else if (action === 'decrement') {
      activity = 'level-down';
    } else if (action === 'reset') {
      activity = 'reset';
    }

    if (item.level === 0) {
      item.nextReviewDate = now; // Set the next review date to now
    } else {
      const itemLevel = await ItemLevel.findOne({ num: item.level });
      item.nextReviewDate = new Date(now + (60 * 60 * 1000 * itemLevel.timeToNext)).setMinutes(0, 0, 0); // Set the next review date to 1 hour from now
    }
    item.activity.push({
      type: activity,
      date: now // Current date/time
    });

    if (action === 'increment' && item.level === maxLevel) {
      item.activity.push({
        type: 'complete',
        date: now // Current date/time
      });
    }

    await item.save();

    res.status(200).json({ message: 'Item level updated successfully', item });
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating Item level', error: error.message });
  }
};

exports.dueReviews = async (req, res) => {
  const { userId, hours } = req.params;
  const numHours = parseInt(hours, 10);

  if (isNaN(numHours)) {
    return res.status(400).json({ message: 'Invalid hours parameter' });
  }

  const now = new Date();
  const targetTime = new Date(now.getTime() + (numHours * 60 * 60 * 1000));

  try {
    const dueItems = await Item.find({
      userId: userId,
      nextReviewDate: { $lte: targetTime }
    }).exec();

    //console.log('dueItems: ' + dueItems);

    // Fetch IDs of items that already have lessons
    const itemsWithLessons = await Lesson.find({
      userId: userId
    }, 'itemId').exec(); // Assuming 'itemId' is how lessons reference items

    //console.log('itemsWithLessons: ' + itemsWithLessons);
    const itemsWithLessonsIds = itemsWithLessons.map(lesson => lesson.itemId.toString());
    //console.log('itemsWithLessonsIds: ' + itemsWithLessonsIds);

    // Filter out items that have lessons
    const itemsDueWithoutLessons = dueItems.filter(item => !itemsWithLessonsIds.includes(item._id.toString()));

    //console.log('itemsDueWithoutLessons: ' + itemsDueWithoutLessons);
    res.json({ itemsDueWithoutLessons });
  } catch (error) {
    console.error('Error counting review items:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

exports.countReviews = async (req, res) => {
  const { userId, hours } = req.params;
  const numHours = parseInt(hours, 10);

  if (isNaN(numHours)) {
    return res.status(400).json({ message: 'Invalid hours parameter' });
  }

  const now = new Date();
  const targetTime = new Date(now.getTime() + (numHours * 60 * 60 * 1000));

  try {
    const dueItemCount = await Item.countDocuments({
      userId: userId,
      nextReviewDate: { $lte: targetTime }
    });

    // Count lessons for the user's items
    const lessonCount = await Lesson.countDocuments({
      userId: userId
    });

    // Subtract the number of lessons from the number of due items
    const adjustedCount = dueItemCount - lessonCount;

    res.json({ adjustedCount });
  } catch (error) {
    console.error('Error counting review items:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

exports.upcomingReviewsByHour = async (req, res) => {
  const { userId } = req.params;

  try {
    let countsByHour = [];
    const now = new Date();

    for (let hour = 0; hour <= 24; hour++) {
      const startTime = new Date(now.getTime() + ((hour - 1) * 60 * 60 * 1000));
      const endTime = new Date(now.getTime() + ((hour) * 60 * 60 * 1000));

      // Assuming Lesson counts are not time-specific and just an example. Adjust as necessary.
      const lessonCount = await Lesson.countDocuments({
        userId: userId
      });

      if (hour === 0) {
        dueItemCount = await Item.countDocuments({
          userId: userId,
          nextReviewDate: { $lt: endTime }
        }) - lessonCount;
      } else {
        dueItemCount = await Item.countDocuments({
          userId: userId,
          nextReviewDate: { $gte: startTime, $lt: endTime }
        });
      }

      countsByHour.push({ hour: hour, count: dueItemCount });
    }

    res.json(countsByHour);
  } catch (error) {
    console.error('Error counting review items by hour:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

exports.itemStats = async (req, res) => {
  const { userId: userId } = req.params; // Extract the user ID from the request parameters

  try {
    // Step 1: Get all items for the user
    const items = await Item.find({ userId: userId });
    if (!items) {
      return res.status(404).json({ message: 'Item not found' });
    }
    let itemsCounters = items.map(item => {
      // Structure to hold individual counters for this item
      let counters = {
        id: item._id,
        counts: {
          'lesson-complete': 0,
          reset: 0,
          'level-up': 0, // Assuming 'level-up' is combined 'levelup' or 'complete'
          'level-down': 0, // leveldown
          complete: 0
        }
      };

      // Iterate through each activity of the current item
      item.activity.forEach(activity => {
        if (counters.counts.hasOwnProperty(activity.type)) {
          counters.counts[activity.type]++;
        }
      });

      return counters;
    });

    res.status(200).json(itemsCounters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
}
