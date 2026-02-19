const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('GET /api/user/profile for user:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User profile not found');
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        console.log('User profile found');
        res.json(user);
    } catch (err) {
        console.error('Error in GET /api/user/profile:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { name, age, height, weight, fitness_goal, activity_level } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (age) profileFields.age = age;
    if (height) profileFields.height = height;
    if (weight) profileFields.weight = weight;
    if (fitness_goal) profileFields.fitness_goal = fitness_goal;
    if (activity_level) profileFields.activity_level = activity_level;

    try {
        let user = await User.findById(req.user.id);

        if (user) {
            // Update
            user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: profileFields },
                { new: true }
            ).select('-password');
            return res.json(user);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
