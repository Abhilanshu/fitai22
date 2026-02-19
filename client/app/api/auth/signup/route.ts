import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, password, age, gender, height, weight, fitness_goal, activity_level } = await req.json();

        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            height,
            weight,
            fitness_goal,
            activity_level,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        return NextResponse.json({ token });
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
