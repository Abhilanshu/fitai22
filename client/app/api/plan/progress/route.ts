import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import FitnessPlan from '@/models/FitnessPlan';

export async function POST(req: Request) {
    try {
        await connectDB();
        const token = req.headers.get('x-auth-token');

        if (!token) {
            return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const { exerciseName, completed } = await req.json();

        const plan = await FitnessPlan.findOne({ user: decoded.user.id }).sort({ created_at: -1 });

        if (!plan) {
            return NextResponse.json({ msg: 'No plan found' }, { status: 404 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Initialize progress array if it doesn't exist
        if (!plan.progress) {
            plan.progress = [];
        }

        let todayProgress = plan.progress.find((p: any) => {
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
                (e: string) => e !== exerciseName
            );
        }

        await plan.save();
        return NextResponse.json(plan.progress);
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
