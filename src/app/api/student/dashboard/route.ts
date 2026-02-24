import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = session.user.id;

        // Get enrollments with course details
        const enrollments = await Enrollment.find({ student: userId })
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'name image' },
            })
            .sort({ updatedAt: -1 })
            .lean();

        // Map to useful format
        const enrolledCourses = enrollments.map((e: any) => ({
            enrollmentId: e._id,
            courseId: e.course?._id,
            title: e.course?.title || 'Unknown Course',
            instructor: e.course?.instructor?.name || 'Unknown',
            thumbnail: e.course?.thumbnail,
            category: e.course?.category,
            progress: e.progress,
            totalLessons: e.course?.lessons?.length || 0,
            completedLessons: e.completedLessons,
            lastAccessedLesson: e.lastAccessedLesson,
            rating: e.course?.rating,
            enrolledAt: e.createdAt,
            completedAt: e.completedAt,
        }));

        // Stats
        const totalEnrolled = enrollments.length;
        const completedCourses = enrollments.filter((e: any) => e.progress >= 100).length;
        const totalLessonsCompleted = enrollments.reduce(
            (acc: number, e: any) => acc + (e.completedLessons || 0),
            0
        );

        // Recommended courses — published courses user is NOT enrolled in
        const enrolledCourseIds = enrollments.map((e: any) => e.course?._id).filter(Boolean);
        const recommended = await Course.find({
            isPublished: true,
            _id: { $nin: enrolledCourseIds },
        })
            .sort({ rating: -1, studentsCount: -1 })
            .limit(3)
            .populate('instructor', 'name')
            .lean();

        const recommendedCourses = recommended.map((c: any) => ({
            _id: c._id,
            title: c.title,
            instructor: c.instructor?.name || 'Unknown',
            rating: c.rating,
            studentsCount: c.studentsCount,
            price: c.price,
            category: c.category,
        }));

        return NextResponse.json({
            enrolledCourses,
            recommendedCourses,
            stats: {
                totalEnrolled,
                completedCourses,
                totalLessonsCompleted,
                certificates: completedCourses, // 1 certificate per completed course
            },
        });
    } catch (error: any) {
        console.error('Student dashboard error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
    }
}
