const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');

// POST /api/history/log - Log a completed workout
router.post('/log', async (req, res) => {
    try {
        const { userId, duration, caloriesBurned, exercises } = req.body;

        const newLog = new WorkoutLog({
            userId,
            duration,
            caloriesBurned,
            exercises
        });

        await newLog.save();

        // --- BADGE LOGIC ---
        const user = await User.findById(userId);
        const newBadges = [];

        // 1. "First Step" - First Workout
        if (user.totalWorkouts === 0) {
            newBadges.push({
                name: 'First Step',
                icon: 'Footprints',
                description: 'Completed your first workout!'
            });
        }

        // 2. "Squat Master" - 50 Squats in one session
        const squatCount = exercises.reduce((acc, ex) => ex.name === 'Squat' ? acc + ex.reps : acc, 0);
        if (squatCount >= 50 && !user.badges.some(b => b.name === 'Squat Master')) {
            newBadges.push({
                name: 'Squat Master',
                icon: 'Dumbbell',
                description: 'Did 50 Squats in one session!'
            });
        }

        // 3. "Consistency is Key" - 5 Total Workouts
        if (user.totalWorkouts + 1 === 5 && !user.badges.some(b => b.name === ' consistency')) {
            newBadges.push({
                name: 'High Five',
                icon: 'Hand',
                description: 'Completed 5 total workouts!'
            });
        }

        // Update User Stats & Badges
        const update = {
            $inc: {
                totalWorkouts: 1,
                totalMinutes: Math.floor(duration / 60),
                xp: 100 + (newBadges.length * 500) // Bonus XP for badges
            }
        };

        if (newBadges.length > 0) {
            update.$push = { badges: { $each: newBadges } };
        }

        await User.findByIdAndUpdate(userId, update);

        res.status(201).json({ log: newLog, newBadges });
    } catch (err) {
        console.error('Error logging workout:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/history/:userId - Get workout history for calendar
router.get('/:userId', async (req, res) => {
    try {
        const logs = await WorkoutLog.find({ userId: req.params.userId })
            .sort({ date: -1 })
            .select('date duration caloriesBurned exercises'); // Lean query for calendar

        res.json(logs);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/history/stats/:userId - Get aggregate stats for badges
router.get('/stats/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Aggregate data for badges
        const totalWorkouts = await WorkoutLog.countDocuments({ userId });

        const stats = await WorkoutLog.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalDuration: { $sum: "$duration" },
                    totalCalories: { $sum: "$caloriesBurned" },
                    totalReps: { $sum: { $sum: "$exercises.reps" } } // Sum of reps across all exercises
                }
            }
        ]);

        // Streak Calculation (Simple ver: check consecutive days)
        // For now returning basic stats, streak logic can be added later

        res.json({
            totalWorkouts,
            totalDuration: stats[0]?.totalDuration || 0,
            totalCalories: stats[0]?.totalCalories || 0,
            totalReps: stats[0]?.totalReps || 0
        });

    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
