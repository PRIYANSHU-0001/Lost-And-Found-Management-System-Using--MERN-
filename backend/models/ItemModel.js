const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Links the item to the user who posted it
  },
  type: {
    type: String,
    required: true,
    enum: ['Lost', 'Found'], // Must be one of these two values
  },
  title: {
    type: String,
    required: [true, 'Please add a short descriptive title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a detailed description'],
  },
  category: {
    type: String,
    required: true,
    // Define common categories for filtering and AI matching
    enum: ['Electronics', 'Keys', 'Wallets/Purses', 'Bags/Backpacks', 'Clothing', 'ID/Documents', 'Jewelry', 'Other'],
  },
  color: {
    type: String,
  },
  location: {
    type: String,
    required: [true, 'Please specify the location where it was lost/found'],
  },
  dateOccurred: {
    type: Date,
    required: true, // The date the item was lost or found
  },
  images: {
    type: [String], // Array of image URLs from Cloudinary/S3
    required: true,
  },
  status: {
    type: String,
    default: 'Pending', // Status: Pending, Matched, Recovered, Archived
    enum: ['Pending', 'Matched', 'Recovered', 'Archived'],
  },
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;