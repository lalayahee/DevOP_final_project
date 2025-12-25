const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /users - Create user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// GET /users - List users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ name: 1 });
        res.json(users.map(u => ({ _id: u._id, name: u.name, email: u.email })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /users/:id - Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;