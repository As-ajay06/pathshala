import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const enrollments = await Enrollment.find({ student: session.user.id })
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'name image' },
            })
            .sort({ updatedAt: -1 })
            .lean();

        const courses = enrollments.map((e: any) => ({
            enrollmentId: e._id,
            id: e.course?._id,
            title: e.course?.title || 'Unknown Course',
            instructor: e.course?.instructor?.name || 'Unknown',
            thumbnail: e.course?.thumbnail,
            progress: e.progress,
            totalLessons: e.course?.lessons?.length || 0,
            completedLessons: e.completedLessons,
            lastAccessedLesson: e.lastAccessedLesson,
            category: e.course?.category,
            rating: e.course?.rating,
            enrolledAt: e.createdAt,
            completedAt: e.completedAt,
            certificate: e.progress >= 100,
        }));

        return NextResponse.json(courses);
    } catch (error: any) {
        console.error('My courses error:', error);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}
