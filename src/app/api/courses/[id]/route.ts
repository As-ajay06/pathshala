import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const course = await Course.findById(id)
            .populate('instructor', 'name image bio')
            .lean();

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error: any) {
        console.error('Course detail error:', error);
        return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
    }
}
