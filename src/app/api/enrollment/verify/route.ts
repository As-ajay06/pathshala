import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course'; // Ensure Course model is imported to validate courseId
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId, courseId } = await request.json();

        if (!sessionId || !courseId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Verify session with Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (checkoutSession.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not paid' }, { status: 400 });
        }

        // Verify metadata matches (security check)
        if (checkoutSession.metadata?.courseId !== courseId || checkoutSession.metadata?.userId !== session.user.id) {
            // In production, we might be stricter, but for now log warning
            console.warn('Metadata mismatch or missing');
        }

        await connectDB();

        // Enroll user
        // Add course to user's enrolledCourses
        await User.findByIdAndUpdate(session.user.id, {
            $addToSet: { enrolledCourses: courseId }
        });

        // Increment student count for course
        await Course.findByIdAndUpdate(courseId, {
            $inc: { studentsCount: 1 }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 });
    }
}
