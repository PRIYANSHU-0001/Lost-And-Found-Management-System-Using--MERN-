const express = require('express');
const router = express.Router();
const { 
    getItems, 
    createItem, 
    updateItem, 
    deleteItem, // <-- New Import
    getItemById,
    getMyItems  // <-- New Import
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware'); // Import our protection middleware

// 1. Base Route: GET all items (Public), POST a new item (Private)
router.route('/')
    .get(getItems)
    .post(protect, createItem);

// 2. User-Specific Route: GET items posted by current user (Private)
// This is typically done at a separate, protected endpoint.
router.get('/myitems', protect, getMyItems);

// 3. Specific Item Route: GET single item (Public), PUT/Update (Private), DELETE (Private)
router.route('/:id')
    .get(getItemById)
    .put(protect, updateItem)
    .delete(protect, deleteItem); // <-- Added DELETE method

module.exports = router;