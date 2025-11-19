// backend/models/MatchModel.js

const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  // Reference to the Lost Item
  lostItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Item',
  },
  // Reference to the Found Item
  foundItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Item',
  },
  // AI-calculated score (0 to 100)
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  // Status of the match (e.g., New, Contact Initiated, Confirmed)
  status: {
    type: String,
    default: 'New',
    enum: ['New', 'Contact Initiated', 'Confirmed', 'Rejected'],
  },
  // Timestamp when the match was created
  matchedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Includes createdAt and updatedAt
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;