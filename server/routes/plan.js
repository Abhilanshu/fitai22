const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const FitnessPlan = require('../models/FitnessPlan');
const { predictPlan } = require('../utils/mlModel');

// @route   POST api/plan/generate
// @desc    Generate a fitness plan using local JS model
// @access  Private
router.post('/generate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate Plan using local JS model
        const { daily_calories, workout_plan, diet_plan, weekly_plan } = predictPlan(
            user.age,
            user.gender,
            user.height,
            user.weight,
            user.fitness_goal,
            user.activity_level
        );

        // Save Plan to DB
        const newPlan = new FitnessPlan({
            user: req.user.id,
            daily_calories,
            workout_plan: JSON.stringify(workout_plan),
            diet_plan: JSON.stringify(diet_plan),
            weekly_plan: JSON.stringify(weekly_plan),
        });

        const plan = await newPlan.save();
        res.json(plan);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/plan
// @desc    Get user's latest fitness plan
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const plan = await FitnessPlan.findOne({ user: req.user.id }).sort({ created_at: -1 });
        if (!plan) {
            return res.status(404).json({ msg: 'No plan found for this user' });
        }
        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
