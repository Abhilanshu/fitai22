import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await connectDB();
        const token = req.headers.get('x-auth-token');

        if (!token) {
            return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.user.id).select('-password');

        return NextResponse.json(user);
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
