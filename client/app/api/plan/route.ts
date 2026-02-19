import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import FitnessPlan from '@/models/FitnessPlan';

export async function GET(req: Request) {
    try {
        await connectDB();
        const token = req.headers.get('x-auth-token');

        if (!token) {
            return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const plan = await FitnessPlan.findOne({ user: decoded.user.id }).sort({ created_at: -1 });

        if (!plan) {
            // Create and save a comprehensive default plan if none exists
            const newPlan = new FitnessPlan({
                user: decoded.user.id,
                daily_calories: 2000,
                workout_plan: {
                    type: 'General Fitness & Toning',
                    frequency: '4 days/week',
                    duration: '45-60 mins',
                    exercises: [
                        { name: 'Push-ups', sets: '3x12', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
                        { name: 'Bodyweight Squats', sets: '3x20', video: 'https://www.youtube.com/watch?v=m0GcZ24DK6k' },
                        { name: 'Lunges', sets: '3x12/leg', video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
                        { name: 'Plank', sets: '3x60s', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
                        { name: 'Glute Bridges', sets: '3x15', video: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
                        { name: 'Dumbbell Shoulder Press', sets: '3x12', video: 'https://www.youtube.com/watch?v=qEwK657kfLI' },
                        { name: 'Lat Pulldowns', sets: '3x12', video: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
                        { name: 'Russian Twists', sets: '3x20', video: 'https://www.youtube.com/watch?v=wkD8rjkodUI' },
                        { name: 'Mountain Climbers', sets: '3x30s', video: 'https://www.youtube.com/watch?v=nmwgirgXJQM' },
                        { name: 'Jumping Jacks', sets: '3x50', video: 'https://www.youtube.com/watch?v=iSSAk4XCsRA' }
                    ]
                },
                diet_plan: {
                    type: 'Balanced Indian Maintenance',
                    meals: [
                        { name: 'Breakfast', calories: 400, protein: '15g', items: ['Poha / Upma with Peanuts', 'Milk / Tea'] },
                        { name: 'Lunch', calories: 600, protein: '20g', items: ['Roti', 'Seasonal Vegetable', 'Dal', 'Salad'] },
                        { name: 'Snack', calories: 200, protein: '5g', items: ['Fruit', 'Nuts'] },
                        { name: 'Evening', calories: 150, protein: '5g', items: ['Green Tea', 'Roasted Chana'] },
                        { name: 'Dinner', calories: 500, protein: '20g', items: ['Khichdi / Dalia', 'Curd'] }
                    ],
                    description: 'Balanced Indian meals to maintain current weight and energy levels.',
                    estimated_cost: '₹3,000 - ₹4,000 / month'
                },
                weekly_plan: [
                    { day: 'Monday', focus: 'Full Body Strength', description: 'Compound movements for all muscle groups.' },
                    { day: 'Tuesday', focus: 'Rest or Light Cardio', description: 'Walking or cycling.' },
                    { day: 'Wednesday', focus: 'Core & Conditioning', description: 'Ab workouts and stamina building.' },
                    { day: 'Thursday', focus: 'Rest', description: 'Recovery.' },
                    { day: 'Friday', focus: 'Full Body Endurance', description: 'Higher reps, lower weight.' },
                    { day: 'Saturday', focus: 'Active Fun', description: 'Hiking, sports, or swimming.' },
                    { day: 'Sunday', focus: 'Rest', description: 'Relaxation.' }
                ],
                progress: []
            });

            await newPlan.save();
            return NextResponse.json(newPlan);
        }

        return NextResponse.json(plan);
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
