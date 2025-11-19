const asyncHandler = require('express-async-handler');
const Item = require('../models/ItemModel');
// Import the AI Matching function
const { triggerMatching } = require('../utils/matchEngine'); 
// Assuming you have implemented the matchEngine.js utility as discussed previously

// @desc    Get all items (public visibility)
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  // Optional: Add query filtering based on type, category, or location
  const filter = { status: { $ne: 'Archived' } };
  
  if (req.query.type) {
    filter.type = req.query.type; // e.g., ?type=Lost or ?type=Found
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const items = await Item.find(filter)
    .populate('poster', 'name email')
    .sort({ createdAt: -1 }); // Show newest items first

  res.status(200).json(items);
});

// @desc    Get items posted by the current logged-in user
// @route   GET /api/items/myitems
// @access  Private
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ poster: req.user._id })
    .sort({ createdAt: -1 }); // Show newest items first

  res.status(200).json(items);
});


// @desc    Create a new item report (Lost or Found)
// @route   POST /api/items
// @access  Private (Requires JWT)
const createItem = asyncHandler(async (req, res) => {
  const { type, title, description, category, color, location, dateOccurred, images } = req.body;

  // Simple validation check
  if (!title || !description || !category || !location || !images || !type || !dateOccurred) {
    res.status(400);
    throw new Error('Please fill all required fields: type, title, description, category, location, date, and images.');
  }

  const item = await Item.create({
    poster: req.user._id, // Set the poster ID from the protected route middleware
    type,
    title,
    description,
    category,
    color,
    location,
    dateOccurred,
    images,
  });

  if (item) {
    // 💡 IMPORTANT: Trigger the AI matching process in the background
    // We don't need to wait for the match, so we call it without await.
    triggerMatching(item._id); 

    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data received or failed to create item.');
  }
});

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('poster', 'name email universityId');

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Update an item (e.g., change status to Recovered)
// @route   PUT /api/items/:id
// @access  Private (Must be the poster or admin)
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Security check: Only the poster can update the item
  // Note: req.user.id is a string, item.poster is an ObjectId. Use .toString() for comparison.
  if (item.poster.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this item');
  }

  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the new, modified document
  });

  res.status(200).json(updatedItem);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (Must be the poster or admin)
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    // Security check: Only the poster can delete the item
    if (item.poster.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this item');
    }
    
    await Item.deleteOne({ _id: req.params.id });

    // Optional: Also delete any corresponding Match records related to this item
    // await Match.deleteMany({ $or: [{ lostItemId: req.params.id }, { foundItemId: req.params.id }] });

    res.status(200).json({ message: 'Item removed successfully' });
});


module.exports = {
  getItems,
  getMyItems, // New export
  createItem,
  updateItem,
  deleteItem, // New export
  getItemById,
};