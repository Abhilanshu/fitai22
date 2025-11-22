import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        let user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ errors: [{ msg: 'Invalid Credentials' }] }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ errors: [{ msg: 'Invalid Credentials' }] }, { status: 400 });
        }

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
