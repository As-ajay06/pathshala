import { NextResponse } from 'next/server';
import getRazorpay from '@/lib/razorpay';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Order Schema for storing payment orders
const orderSchema = new mongoose.Schema({
    razorpayOrderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    paymentId: String,
    signature: String,
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// POST - Create a new Razorpay order
export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const { courseId, userId, amount, currency = 'INR', courseName } = body;

        if (!courseId || !userId || !amount) {
            return NextResponse.json(
                { message: 'Missing required fields: courseId, userId, amount' },
                { status: 400 }
            );
        }

        // Create order in Razorpay
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: `course_${courseId}_${Date.now()}`,
            notes: {
                courseId,
                userId,
                courseName: courseName || 'Course Purchase',
            },
        };

        const razorpayOrder = await getRazorpay().orders.create(options);

        // Save order to database
        const order = await Order.create({
            razorpayOrderId: razorpayOrder.id,
            userId,
            courseId,
            amount,
            currency,
            status: 'created',
        });

        return NextResponse.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}

// GET - Get order details
export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const userId = searchParams.get('userId');

        if (orderId) {
            const order = await Order.findOne({ razorpayOrderId: orderId })
                .populate('courseId', 'title price thumbnail')
                .populate('userId', 'name email');

            if (!order) {
                return NextResponse.json({ message: 'Order not found' }, { status: 404 });
            }
            return NextResponse.json({ order });
        }

        if (userId) {
            const orders = await Order.find({ userId })
                .sort({ createdAt: -1 })
                .populate('courseId', 'title price thumbnail');
            return NextResponse.json({ orders });
        }

        return NextResponse.json({ message: 'Please provide orderId or userId' }, { status: 400 });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
