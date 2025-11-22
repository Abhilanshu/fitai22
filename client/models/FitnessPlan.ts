import mongoose from 'mongoose';

const FitnessPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    daily_calories: {
        type: Number,
        required: true,
    },
    workout_plan: {
        type: mongoose.Schema.Types.Mixed, // Can be string or object
        required: true,
    },
    diet_plan: {
        type: mongoose.Schema.Types.Mixed, // Can be string or object
        required: true,
    },
    weekly_plan: {
        type: mongoose.Schema.Types.Mixed, // Can be string or array
        required: true,
    },
    progress: [{
        date: { type: Date, default: Date.now },
        completed_exercises: [String] // Array of exercise names completed
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.FitnessPlan || mongoose.model('FitnessPlan', FitnessPlanSchema);
