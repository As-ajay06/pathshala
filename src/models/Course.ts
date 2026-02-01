import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILesson {
    title: string;
    type: 'video' | 'text' | 'quiz';
    content?: string; // For text lessons
    videoUrl?: string; // For video lessons
    duration: string;
    isFreePreview: boolean;
}

export interface ICourse extends Document {
    title: string;
    subtitle?: string;
    description: string;
    thumbnail?: string;
    instructor: mongoose.Types.ObjectId;
    price: number;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    language: string;
    tags: string[];
    lessons: ILesson[];
    isPublished: boolean;
    rating: number;
    reviewsCount: number;
    studentsCount: number;
    embedding?: number[]; // For AI Vector Search
    aiSummary?: string;   // For AI Content Summary
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'text', 'quiz'], required: true },
    content: String,
    videoUrl: String,
    duration: String,
    isFreePreview: { type: Boolean, default: false }
});

const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        subtitle: String,
        description: { type: String, required: true },
        thumbnail: String,
        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        price: { type: Number, default: 0 },
        category: { type: String, required: true },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
        language: { type: String, default: 'English' },
        tags: [String],
        lessons: [LessonSchema],
        isPublished: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        studentsCount: { type: Number, default: 0 },
        embedding: { type: [Number], select: false }, // Hide embedding by default for performance
        aiSummary: String
    },
    { timestamps: true }
);

// Text index for basic search
CourseSchema.index({ title: 'text', description: 'text', category: 'text' });
// Vector index is defined in Atlas UI, not here strictly, but good to know

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
