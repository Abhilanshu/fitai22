import mongoose from 'mongoose';

const FitnessPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workout_plan: {
        type: Object, // Storing as Object since we're in the same app now
        required: true,
    },
    diet_plan: {
        type: Object,
        required: true,
    },
    daily_calories: {
        type: Number,
        required: true,
    },
    weekly_plan: {
        type: Array,
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

export default mongoose.models.FitnessPlan || mongoose.model('FitnessPlan', FitnessPlanSchema);
