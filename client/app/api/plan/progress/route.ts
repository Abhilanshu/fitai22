import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import FitnessPlan from '@/models/FitnessPlan';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

const verifyToken = (req: Request) => {
    const authHeader = req.headers.get('x-auth-token');
    if (!authHeader) return null;
    try {
        const decoded = jwt.verify(authHeader, JWT_SECRET) as any;
        return decoded.user;
    } catch (err) {
        return null;
    }
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const userAuth = verifyToken(req);
        if (!userAuth) {
            return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
        }

        const { exerciseName, completed } = await req.json();

        // Find the user's plan
        const plan = await FitnessPlan.findOne({ user: userAuth.id }).sort({ created_at: -1 });
        if (!plan) {
            return NextResponse.json({ msg: 'No plan found' }, { status: 404 });
        }

        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Ensure progress array exists
        if (!plan.progress) {
            plan.progress = [];
        }

        // Find or create progress entry for today
        let progressEntry = plan.progress.find((p: any) => {
            const pDate = new Date(p.date);
            pDate.setHours(0, 0, 0, 0);
            return pDate.getTime() === today.getTime();
        });

        if (!progressEntry) {
            // Create new entry if not exists
            plan.progress.push({
                date: today,
                completed_exercises: completed ? [exerciseName] : []
            });
        } else {
            // Update existing entry
            if (completed) {
                if (!progressEntry.completed_exercises.includes(exerciseName)) {
                    progressEntry.completed_exercises.push(exerciseName);
                }
            } else {
                progressEntry.completed_exercises = progressEntry.completed_exercises.filter((e: string) => e !== exerciseName);
            }
        }

        await plan.save();
        return NextResponse.json(plan.progress);

    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
