const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Escape regex metacharacters so user input is matched literally (prevents ReDoS)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase database. Remember to use the await keyword and store the connection in `db`
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Add the name filter to the query if the name parameter is not empty
        // Coerce query values to strings so operators like ?category[$ne]=x cannot be injected
        const name = String(req.query.name || '');
        if (name.trim() !== '') {
            query.name = { $regex: escapeRegex(name), $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = String(req.query.category);
        }
        if (req.query.condition) {
            query.condition = String(req.query.condition);
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(String(req.query.age_years), 10) };
        }

        // Task 4: Fetch filtered gifts using the find(query) method. Make sure to use await and store the result in the `gifts` constant
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
