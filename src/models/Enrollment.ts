import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    progress: number;
    completedLessons: number;
    lastAccessedLesson?: string;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
    {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        completedLessons: { type: Number, default: 0 },
        lastAccessedLesson: String,
        completedAt: Date,
    },
    { timestamps: true }
);

// Ensure a student can only enroll once per course
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment;
