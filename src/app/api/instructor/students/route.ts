import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = session.user.id;

        // Get instructor's course IDs
        const courses = await Course.find({ instructor: userId }).select('_id title').lean();
        const courseIds = courses.map((c: any) => c._id);
        const courseMap: Record<string, string> = {};
        courses.forEach((c: any) => {
            courseMap[c._id.toString()] = c.title;
        });

        // Get all enrollments for those courses
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('student', 'name email image')
            .sort({ createdAt: -1 })
            .lean();

        // Map students with enrollment data
        const students = enrollments.map((e: any) => ({
            enrollmentId: e._id,
            studentId: e.student?._id,
            name: e.student?.name || 'Unknown',
            email: e.student?.email || '',
            avatar: e.student?.image,
            courseId: e.course,
            courseTitle: courseMap[e.course?.toString()] || 'Unknown Course',
            progress: e.progress,
            completedLessons: e.completedLessons,
            enrolledAt: e.createdAt,
            lastActive: e.updatedAt,
            status: e.progress >= 100 ? 'completed' : e.progress > 0 ? 'active' : 'inactive',
        }));

        return NextResponse.json(students);
    } catch (error: any) {
        console.error('Instructor students error:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}
