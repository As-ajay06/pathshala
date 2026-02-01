import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'student' | 'instructor';
    bio?: string;
    enrolledCourses: mongoose.Types.ObjectId[];
    wishlist: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        image: String,
        role: { type: String, enum: ['student', 'instructor'], default: 'student' },
        bio: String,
        enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
    },
    { timestamps: true }
);

// Prevent model recompilation error in Next.js hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
