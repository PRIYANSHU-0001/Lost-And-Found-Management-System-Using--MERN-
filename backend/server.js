const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import Routes and Middleware
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes'); // Import Item Management Routes
const { errorHandler } = require('./middleware/errorMiddleware'); 

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- MIDDLEWARE SETUP ---
// Enable CORS for client-server communication
app.use(cors()); 
// To parse incoming JSON bodies
app.use(express.json()); 

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    // Connects using the MONGO_URI from the .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1); 
  }
};

// Connect to the database
connectDB();

// --- ROUTE DEFINITIONS ---

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Lost & Found API is running...');
});

// 1. Authentication Routes (e.g., /api/auth/register, /api/auth/login)
app.use('/api/auth', authRoutes);

// 2. Item Management Routes (e.g., /api/items, /api/items/:id)
app.use('/api/items', itemRoutes);

// --- CUSTOM ERROR HANDLING MIDDLEWARE ---
// Must be added AFTER all route definitions to catch errors properly
app.use(errorHandler);


// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));