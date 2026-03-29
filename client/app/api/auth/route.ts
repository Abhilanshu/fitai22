import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

// @route   GET /api/auth
// @desc    Get logged in user
// @access  Private
export async function GET(req: Request) {
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

        return NextResponse.json(user);
    } catch (err: any) {
        console.error('Auth GET Error:', err.message);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return NextResponse.json({ msg: 'Token is not valid' }, { status: 401 });
        }
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
