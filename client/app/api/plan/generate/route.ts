import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FitnessPlan from '@/models/FitnessPlan';
import { predictPlan } from '@/lib/mlModel';

export async function POST(req: Request) {
    try {
        await connectDB();
        const token = req.headers.get('x-auth-token');

        if (!token) {
            return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.user.id).select('-password');

        if (!user) {
            return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        }

        const { daily_calories, workout_plan, diet_plan, weekly_plan } = predictPlan(
            user.age,
            user.gender,
            user.height,
            user.weight,
            user.fitness_goal,
            user.activity_level
        );

        const newPlan = new FitnessPlan({
            user: decoded.user.id,
            daily_calories,
            workout_plan,
            diet_plan,
            weekly_plan,
        });

        const plan = await newPlan.save();
        return NextResponse.json(plan);

    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
