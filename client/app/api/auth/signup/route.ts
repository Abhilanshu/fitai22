import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { predictPlan } from '@/lib/mlModel'; // We need to move mlModel to lib too
import FitnessPlan from '@/models/FitnessPlan';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, password, age, gender, height, weight, fitness_goal, activity_level } = await req.json();

        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ errors: [{ msg: 'User already exists' }] }, { status: 400 });
        }

        user = new User({
            name,
            email,
            password,
            age,
            gender,
            height,
            weight,
            fitness_goal,
            activity_level,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Generate Initial Plan
        const planData = predictPlan(age, gender, height, weight, fitness_goal, activity_level);

        const newPlan = new FitnessPlan({
            user: user._id,
            ...planData
        });
        await newPlan.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' });

        return NextResponse.json({ token });
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
