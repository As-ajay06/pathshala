import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Live Class Schema
const liveClassSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 }, // in minutes
    maxAttendees: { type: Number, default: 100 },
    status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
    isPublic: { type: Boolean, default: true },
    enableRecording: { type: Boolean, default: true },
    enableChat: { type: Boolean, default: true },
    enableQA: { type: Boolean, default: true },
    tags: [String],
    meetingLink: String,
    recordingUrl: String,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const LiveClass = mongoose.models.LiveClass || mongoose.model('LiveClass', liveClassSchema);

// GET - Fetch all live classes for instructor
export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const instructorId = searchParams.get('instructorId');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');

        const query: any = {};
        if (instructorId) query.instructorId = instructorId;
        if (status && status !== 'all') query.status = status;

        const skip = (page - 1) * limit;

        const classes = await LiveClass.find(query)
            .sort({ scheduledAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('courseId', 'title')
            .populate('instructorId', 'name email image');

        const total = await LiveClass.countDocuments(query);

        return NextResponse.json({
            classes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error: any) {
        console.error('Error fetching live classes:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST - Create a new live class
export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            title,
            description,
            instructorId,
            courseId,
            scheduledAt,
            duration,
            maxAttendees,
            isPublic,
            enableRecording,
            enableChat,
            enableQA,
            tags,
        } = body;

        if (!title || !instructorId || !scheduledAt) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Generate a unique meeting link
        const meetingId = Math.random().toString(36).substring(2, 15);
        const meetingLink = `https://meet.learnflow.com/${meetingId}`;

        const liveClass = await LiveClass.create({
            title,
            description,
            instructorId,
            courseId,
            scheduledAt: new Date(scheduledAt),
            duration: duration || 60,
            maxAttendees: maxAttendees || 100,
            isPublic: isPublic !== undefined ? isPublic : true,
            enableRecording: enableRecording !== undefined ? enableRecording : true,
            enableChat: enableChat !== undefined ? enableChat : true,
            enableQA: enableQA !== undefined ? enableQA : true,
            tags: tags || [],
            meetingLink,
            status: 'scheduled',
        });

        return NextResponse.json({
            message: 'Live class created successfully',
            liveClass,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating live class:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
