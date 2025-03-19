const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = await userRepository.createUser(username, email, password);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
