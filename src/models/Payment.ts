import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    method: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    orderId: string;
    razorpayPaymentId?: string;
    stripeSessionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        method: { type: String, default: 'razorpay' },
        status: {
            type: String,
            enum: ['completed', 'pending', 'failed', 'refunded'],
            default: 'pending',
        },
        orderId: { type: String, required: true },
        razorpayPaymentId: String,
        stripeSessionId: String,
    },
    { timestamps: true }
);

PaymentSchema.index({ user: 1 });
PaymentSchema.index({ course: 1 });

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
