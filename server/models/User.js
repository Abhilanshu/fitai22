const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0
    },
    badges: [{
        name: String, // e.g., "First Step"
        dateEarned: { type: Date, default: Date.now },
        icon: String, // lucide icon name
        description: String
    }],
    totalWorkouts: {
        type: Number,
        default: 0
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    height: {
        type: Number, // in cm
        required: true,
    },
    weight: {
        type: Number, // in kg
        required: true,
    },
    fitness_goal: {
        type: String,
        required: true,
        enum: ['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness'],
    },
    activity_level: {
        type: String,
        required: true,
        enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
