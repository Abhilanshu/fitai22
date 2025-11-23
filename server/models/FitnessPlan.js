const mongoose = require('mongoose');

const FitnessPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    workout_plan: {
        type: String, // Can be a JSON string or structured object if we want more detail
        required: true,
    },
    diet_plan: {
        type: String,
        required: true,
    },
    daily_calories: {
        type: Number,
        required: true,
    },
    weekly_plan: {
        type: String,
    },
    progress: [
        {
            date: {
                type: Date,
                default: Date.now,
            },
            completed_exercises: [String],
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('FitnessPlan', FitnessPlanSchema);
