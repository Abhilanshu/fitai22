const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/leaderboard
// @desc    Get top 10 users by XP
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ xp: -1 })
            .limit(10)
            .select('name xp badges totalWorkouts');

        res.json(topUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
