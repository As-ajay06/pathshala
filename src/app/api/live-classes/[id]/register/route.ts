import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

const LiveClass = mongoose.models.LiveClass;

// POST - Register a user for a live class
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const liveClass = await LiveClass.findById(id);

        if (!liveClass) {
            return NextResponse.json({ message: 'Live class not found' }, { status: 404 });
        }

        // Check if class is full
        if (liveClass.attendees.length >= liveClass.maxAttendees) {
            return NextResponse.json({ message: 'Class is full' }, { status: 400 });
        }

        // Check if user is already registered
        if (liveClass.attendees.includes(userId)) {
            return NextResponse.json({ message: 'Already registered for this class' }, { status: 400 });
        }

        // Add user to attendees
        liveClass.attendees.push(userId);
        await liveClass.save();

        return NextResponse.json({
            message: 'Successfully registered for the class',
            liveClass,
        });
    } catch (error: any) {
        console.error('Error registering for live class:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE - Unregister a user from a live class
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const liveClass = await LiveClass.findById(id);

        if (!liveClass) {
            return NextResponse.json({ message: 'Live class not found' }, { status: 404 });
        }

        // Remove user from attendees
        liveClass.attendees = liveClass.attendees.filter(
            (attendee: any) => attendee.toString() !== userId
        );
        await liveClass.save();

        return NextResponse.json({
            message: 'Successfully unregistered from the class',
        });
    } catch (error: any) {
        console.error('Error unregistering from live class:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
