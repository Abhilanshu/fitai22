import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FitnessPlan from '@/models/FitnessPlan';
import { predictPlan } from '@/lib/mlModel';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Helper to verify token
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

        const user = await User.findById(userAuth.id).select('-password');
        if (!user) {
            return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        }

        // Generate Plan
        const planData = predictPlan(
            user.age,
            user.gender,
            user.height,
            user.weight,
            user.fitness_goal,
            user.activity_level
        );

        // Save Plan to DB
        const newPlan = new FitnessPlan({
            user: userAuth.id,
            ...planData
        });

        const plan = await newPlan.save();
        return NextResponse.json(plan);

    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const userAuth = verifyToken(req);
        if (!userAuth) {
            return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
        }

        const plan = await FitnessPlan.findOne({ user: userAuth.id }).sort({ created_at: -1 });
        if (!plan) {
            return NextResponse.json({ msg: 'No plan found' }, { status: 404 });
        }
        return NextResponse.json(plan);
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
