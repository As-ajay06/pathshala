import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Payment from '@/models/Payment';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const payments = await Payment.find({ user: session.user.id })
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .lean();

        const mapped = payments.map((p: any) => ({
            _id: p._id,
            orderId: p.orderId,
            course: p.course?.title || 'Unknown Course',
            courseId: p.course?._id,
            amount: p.amount,
            currency: p.currency,
            method: p.method,
            status: p.status,
            date: p.createdAt,
        }));

        return NextResponse.json(mapped);
    } catch (error: any) {
        console.error('Student payments error:', error);
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}
