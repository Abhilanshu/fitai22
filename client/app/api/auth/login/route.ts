import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        let user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
        }

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
