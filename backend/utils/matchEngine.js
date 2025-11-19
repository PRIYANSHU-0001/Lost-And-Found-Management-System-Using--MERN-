// backend/utils/matchEngine.js

const stringSimilarity = require('string-similarity');
const Item = require('../models/ItemModel');
const Match = require('../models/MatchModel'); // Assuming you have created this model

// Threshold for a match to be considered strong enough to notify users
const MATCH_THRESHOLD = 0.75; 

// Utility function to calculate Text Similarity Score
function calculateTextScore(itemA, itemB) {
    const descriptionA = `${itemA.title} ${itemA.description} ${itemA.category} ${itemA.color}`;
    const descriptionB = `${itemB.title} ${itemB.description} ${itemB.category} ${itemB.color}`;
    
    // Uses the Jaccard Index or similar algorithm to compare full strings
    const similarity = stringSimilarity.compareTwoStrings(descriptionA, descriptionB);
    
    // Returns a score between 0 and 1
    return similarity; 
}

// Utility function to calculate Location/Time Proximity Score
function calculateContextScore(itemA, itemB) {
    let locationScore = 0;
    let dateScore = 0;
    
    // Location Match (Simple: check if one location string is contained in the other)
    const locA = itemA.location.toLowerCase();
    const locB = itemB.location.toLowerCase();
    
    if (locA.includes(locB) || locB.includes(locA)) {
        locationScore = 0.5;
    }
    
    // Time Match (Calculate difference in days)
    const date1 = new Date(itemA.dateOccurred).getTime();
    const date2 = new Date(itemB.dateOccurred).getTime();
    const diffDays = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24); // Difference in days
    
    // Full score (0.5) if difference is 0 days, drops off quickly after 7 days
    if (diffDays <= 7) {
        dateScore = 0.5 * (1 - (diffDays / 7)); 
    }

    return locationScore + dateScore; // Max score is 1.0
}

// Placeholder for Image Similarity (This requires external setup)
function calculateImageScore(imageUrlsA, imageUrlsB) {
    // ⚠️ IMPLEMENTATION NOTE: 
    // This is where you would integrate image hashing or call a Python microservice.
    // For now, we return a moderate placeholder score if categories match, 
    // or you can implement a basic image size/metadata comparison.
    
    // For MVP (Minimum Viable Product), let's return a random score to simulate AI
    // In production, this would be a deep learning output or image hash comparison.
    
    const randomScore = Math.random() * 0.4 + 0.5; // Score between 0.5 and 0.9
    return randomScore;
}


// MAIN MATCHING FUNCTION
const triggerMatching = async (newItemId) => {
    const newItem = await Item.findById(newItemId);
    if (!newItem) return;

    const targetType = newItem.type === 'Lost' ? 'Found' : 'Lost';
    
    // Find all items of the opposite type that are still 'Pending'
    const targetItems = await Item.find({ type: targetType, status: 'Pending' });

    console.log(`Matching ${newItem.type} item ${newItemId} against ${targetItems.length} ${targetType} items.`);

    for (const targetItem of targetItems) {
        // --- 1. Calculate Individual Scores ---
        const textScore = calculateTextScore(newItem, targetItem);
        const imageScore = calculateImageScore(newItem.images, targetItem.images);
        const contextScore = calculateContextScore(newItem, targetItem);
        
        // --- 2. Calculate Final Weighted Score ---
        const finalScore = (0.4 * textScore) + (0.5 * imageScore) + (0.1 * contextScore);
        
        console.log(`Match Score with ${targetItem._id}: ${finalScore.toFixed(3)}`);

        // --- 3. Check Threshold and Save Match ---
        if (finalScore >= MATCH_THRESHOLD) {
            console.log('--- POTENTIAL MATCH FOUND ---');
            
            // Determine which ID is lost and which is found for the Match schema
            const lostItemId = newItem.type === 'Lost' ? newItem._id : targetItem._id;
            const foundItemId = newItem.type === 'Lost' ? targetItem._id : newItem._id;
            
            // Save the Match result
            await Match.create({
                lostItemId,
                foundItemId,
                matchScore: finalScore * 100, // Store as percentage
            });

            // 💡 TO-DO: Implement a real-time notification (e.g., using WebSockets or Email)
            // notifyUser(newItem.poster, 'Match Found!');
            // notifyUser(targetItem.poster, 'Match Found!');

            // Update item statuses to 'Matched'
            await Item.findByIdAndUpdate(newItemId, { status: 'Matched' });
            await Item.findByIdAndUpdate(targetItem._id, { status: 'Matched' });
        }
    }
};

module.exports = { triggerMatching };