import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

const Order = mongoose.models.Order;
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' },
    paymentId: String,
    orderId: String,
    amountPaid: Number,
}, { timestamps: true }));

// POST - Verify payment and complete enrollment
export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { message: 'Missing payment verification parameters' },
                { status: 400 }
            );
        }

        // Verify signature
        const body_data = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body_data)
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return NextResponse.json(
                { message: 'Invalid payment signature', verified: false },
                { status: 400 }
            );
        }

        // Update order status
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                status: 'paid',
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Create enrollment
        const existingEnrollment = await Enrollment.findOne({
            userId: order.userId,
            courseId: order.courseId,
        });

        if (!existingEnrollment) {
            await Enrollment.create({
                userId: order.userId,
                courseId: order.courseId,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                amountPaid: order.amount,
            });
        }

        return NextResponse.json({
            verified: true,
            message: 'Payment verified and enrollment completed',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { message: error.message || 'Payment verification failed', verified: false },
            { status: 500 }
        );
    }
}
