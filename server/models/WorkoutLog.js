const mongoose = require('mongoose');

const WorkoutLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    exercises: [
        {
            name: { type: String, required: true },
            reps: { type: Number, required: true },
            sets: { type: Number, default: 1 },
            duration: { type: Number } // seconds spent on this specific exercise
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);
