const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger
const logger = pino();  // Create a Pino logger instance

dotenv.config();

// Create JWT secret from the .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res) => {
    try {
        // Task 1: Read and validate the registration details (values must be non-empty strings)
        const { email, firstName, lastName, password } = req.body;
        if ([email, firstName, lastName, password].some(v => typeof v !== 'string' || v.trim() === '')) {
            return res.status(400).json({ error: 'email, firstName, lastName and password are required' });
        }

        // Task 2: Connect to MongoDB and get the users collection
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 3: Check for an existing user with the same email
        const existingEmail = await collection.findOne({ email: email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        // Task 4: Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        // Task 5: Save the user details in the database
        const newUser = await collection.insertOne({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 6: Create a JWT authentication token using the new user's id
        const payload = {
            user: {
                id: newUser.insertedId.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        // Task 7: Return the token and the email
        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
