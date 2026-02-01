import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { fullName, email, password, role } = await request.json();

        if (!fullName || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: fullName,
            email,
            password: hashedPassword,
            role: role || 'student',
            image: '',
        });

        return NextResponse.json({ message: 'User created successfully', userId: newUser._id }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
