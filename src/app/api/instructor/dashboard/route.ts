import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = session.user.id;

        // Get instructor's courses
        const courses = await Course.find({ instructor: userId })
            .sort({ createdAt: -1 })
            .lean();

        const courseIds = courses.map((c: any) => c._id);

        // Get total students across all courses
        const totalStudents = courses.reduce((acc: number, c: any) => acc + (c.studentsCount || 0), 0);

        // Get total earnings
        const earningsResult = await Payment.aggregate([
            { $match: { course: { $in: courseIds }, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalEarnings = earningsResult[0]?.total || 0;

        // Average rating
        const publishedCourses = courses.filter((c: any) => c.isPublished && c.rating > 0);
        const avgRating = publishedCourses.length > 0
            ? publishedCourses.reduce((acc: number, c: any) => acc + c.rating, 0) / publishedCourses.length
            : 0;

        // Map courses for display
        const mappedCourses = courses.map((c: any) => ({
            _id: c._id,
            title: c.title,
            studentsCount: c.studentsCount || 0,
            rating: c.rating || 0,
            isPublished: c.isPublished,
            lessonsCount: c.lessons?.length || 0,
            thumbnail: c.thumbnail,
            createdAt: c.createdAt,
        }));

        // Get course-level earnings
        const courseEarnings = await Payment.aggregate([
            { $match: { course: { $in: courseIds }, status: 'completed' } },
            { $group: { _id: '$course', total: { $sum: '$amount' } } },
        ]);
        const earningsMap: Record<string, number> = {};
        courseEarnings.forEach((e: any) => {
            earningsMap[e._id.toString()] = e.total;
        });
        const coursesWithEarnings = mappedCourses.map((c: any) => ({
            ...c,
            revenue: earningsMap[c._id.toString()] || 0,
        }));

        return NextResponse.json({
            stats: {
                totalCourses: courses.length,
                totalStudents,
                totalEarnings,
                avgRating: Math.round(avgRating * 10) / 10,
            },
            courses: coursesWithEarnings,
        });
    } catch (error: any) {
        console.error('Instructor dashboard error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
    }
}
