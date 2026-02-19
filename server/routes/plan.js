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
        console.log('Generating plan for user:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }
        console.log('User details:', { age: user.age, gender: user.gender, goal: user.fitness_goal });

        // Generate Plan using local JS model
        console.log('Predicting plan...');
        const { daily_calories, workout_plan, diet_plan, weekly_plan } = predictPlan(
            user.age,
            user.gender,
            user.height,
            user.weight,
            user.fitness_goal,
            user.activity_level
        );
        console.log('Plan predicted successfully');

        // Save Plan to DB
        const newPlan = new FitnessPlan({
            user: req.user.id,
            daily_calories,
            workout_plan: JSON.stringify(workout_plan),
            diet_plan: JSON.stringify(diet_plan),
            weekly_plan: JSON.stringify(weekly_plan),
        });

        console.log('Saving plan to DB...');
        const plan = await newPlan.save();
        console.log('Plan saved:', plan._id);
        res.json(plan);

    } catch (err) {
        console.error('Error in plan generation:', err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/plan
// @desc    Get user's latest fitness plan
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        console.log('GET /api/plan request for user:', req.user.id);
        const plan = await FitnessPlan.findOne({ user: req.user.id }).sort({ created_at: -1 });

        if (!plan) {
            console.log('No plan found for user');
            return res.status(404).json({ msg: 'No plan found for this user' });
        }
        console.log('Plan found:', plan._id);

        // Helper to safely parse JSON
        const safeParse = (jsonString, fallback) => {
            try {
                if (typeof jsonString === 'object') return jsonString; // Already an object
                return JSON.parse(jsonString);
            } catch (e) {
                console.warn('JSON Parse Error for plan data:', e.message);
                return fallback;
            }
        };

        // Parse JSON strings back to objects
        // Use toObject() instead of _doc to avoid mongoose internal issues
        const plainPlan = plan.toObject();

        const formattedPlan = {
            ...plainPlan,
            workout_plan: safeParse(plainPlan.workout_plan, {}),
            diet_plan: safeParse(plainPlan.diet_plan, {}),
            weekly_plan: safeParse(plainPlan.weekly_plan, []),
        };

        console.log('Sending formatted plan');
        res.json(formattedPlan);
    } catch (err) {
        console.error('Error in GET /api/plan:', err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/plan/progress
// @desc    Update daily progress
// @access  Private
router.post('/progress', auth, async (req, res) => {
    try {
        const { exerciseName, completed } = req.body;
        const plan = await FitnessPlan.findOne({ user: req.user.id }).sort({ created_at: -1 });

        if (!plan) {
            return res.status(404).json({ msg: 'No plan found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Initialize progress array if it doesn't exist
        if (!plan.progress) {
            plan.progress = [];
        }

        let todayProgress = plan.progress.find((p) => {
            const pDate = new Date(p.date);
            pDate.setHours(0, 0, 0, 0);
            return pDate.getTime() === today.getTime();
        });

        if (!todayProgress) {
            plan.progress.push({ date: today, completed_exercises: [] });
            todayProgress = plan.progress[plan.progress.length - 1];
        }

        if (completed) {
            if (!todayProgress.completed_exercises.includes(exerciseName)) {
                todayProgress.completed_exercises.push(exerciseName);
            }
        } else {
            todayProgress.completed_exercises = todayProgress.completed_exercises.filter(
                (e) => e !== exerciseName
            );
        }

        await plan.save();
        res.json(plan.progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/plan/diet-log
// @desc    Update daily diet log
// @access  Private
router.post('/diet-log', auth, async (req, res) => {
    try {
        const { mealName, eaten } = req.body; // eaten = true/false
        const plan = await FitnessPlan.findOne({ user: req.user.id }).sort({ created_at: -1 });

        if (!plan) return res.status(404).json({ msg: 'No plan found' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!plan.diet_logs) plan.diet_logs = [];

        let todayLog = plan.diet_logs.find((log) => {
            const d = new Date(log.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        if (!todayLog) {
            plan.diet_logs.push({ date: today, completed_meals: [] });
            todayLog = plan.diet_logs[plan.diet_logs.length - 1];
        }

        if (eaten) {
            if (!todayLog.completed_meals.includes(mealName)) {
                todayLog.completed_meals.push(mealName);
            }
        } else {
            todayLog.completed_meals = todayLog.completed_meals.filter(m => m !== mealName);
        }

        await plan.save();
        res.json(todayLog.completed_meals);
    } catch (err) {
        console.error('Error logging diet:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
