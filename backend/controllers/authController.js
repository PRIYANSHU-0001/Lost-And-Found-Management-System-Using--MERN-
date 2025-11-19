const asyncHandler = require('express-async-handler'); // Helper to handle async errors without wrapping in try/catch
const User = require('../models/UserModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { universityId, name, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ universityId });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User with this University ID already exists');
  }

  // 2. Create the new user (password is automatically hashed by the pre-save hook in the model)
  const user = await User.create({
    universityId,
    name,
    email,
    password,
  });

  // 3. Respond with user data and JWT token
  if (user) {
    res.status(201).json({ // Created
      _id: user._id,
      name: user.name,
      email: user.email,
      universityId: user.universityId,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { universityId, password } = req.body;

  // 1. Find user by ID
  const user = await User.findOne({ universityId });

  // 2. Check user existence and password match
  if (user && (await user.matchPassword(password))) {
    // 3. Respond with user data and JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      universityId: user.universityId,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid University ID or password');
  }
});

module.exports = { registerUser, loginUser };