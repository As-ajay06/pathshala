import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

export async function GET() {
    try {
        await connectDB();

        const courses = await Course.find({ isPublished: true })
            .sort({ rating: -1, studentsCount: -1 })
            .limit(6)
            .populate('instructor', 'name image')
            .lean();

        const mapped = courses.map((c: any) => ({
            _id: c._id,
            title: c.title,
            instructor: c.instructor?.name || 'Unknown',
            rating: c.rating,
            studentsCount: c.studentsCount,
            price: c.price,
            category: c.category,
            level: c.level,
            thumbnail: c.thumbnail,
        }));

        return NextResponse.json(mapped);
    } catch (error: any) {
        console.error('Featured courses error:', error);
        return NextResponse.json({ error: 'Failed to fetch featured courses' }, { status: 500 });
    }
}
