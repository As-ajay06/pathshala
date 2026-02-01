import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Reference the LiveClass model
const LiveClass = mongoose.models.LiveClass;

// GET - Fetch a single live class by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const liveClass = await LiveClass.findById(id)
            .populate('courseId', 'title thumbnail')
            .populate('instructorId', 'name email image')
            .populate('attendees', 'name email image');

        if (!liveClass) {
            return NextResponse.json({ message: 'Live class not found' }, { status: 404 });
        }

        return NextResponse.json({ liveClass });
    } catch (error: any) {
        console.error('Error fetching live class:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PATCH - Update a live class
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        const liveClass = await LiveClass.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!liveClass) {
            return NextResponse.json({ message: 'Live class not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Live class updated successfully',
            liveClass,
        });
    } catch (error: any) {
        console.error('Error updating live class:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE - Delete a live class
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const liveClass = await LiveClass.findByIdAndDelete(id);

        if (!liveClass) {
            return NextResponse.json({ message: 'Live class not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Live class deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting live class:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
