import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const level = searchParams.get('level');
        const sort = searchParams.get('sort') || 'popular';
        const search = searchParams.get('q');

        // Build filter
        const filter: Record<string, any> = { isPublished: true };

        if (category && category !== 'All') {
            filter.category = category;
        }
        if (level && level !== 'All Levels') {
            filter.level = level;
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // Build sort
        let sortObj: Record<string, any> = {};
        switch (sort) {
            case 'rating':
                sortObj = { rating: -1 };
                break;
            case 'newest':
                sortObj = { createdAt: -1 };
                break;
            case 'price-low':
                sortObj = { price: 1 };
                break;
            case 'price-high':
                sortObj = { price: -1 };
                break;
            case 'popular':
            default:
                sortObj = { studentsCount: -1 };
                break;
        }

        const courses = await Course.find(filter)
            .sort(sortObj)
            .populate('instructor', 'name image')
            .lean();

        const mapped = courses.map((c: any) => ({
            _id: c._id,
            title: c.title,
            description: c.description,
            thumbnail: c.thumbnail,
            instructor: c.instructor?.name || 'Unknown',
            instructorImage: c.instructor?.image,
            price: c.price,
            category: c.category,
            level: c.level,
            language: c.language,
            tags: c.tags,
            rating: c.rating,
            reviewsCount: c.reviewsCount,
            studentsCount: c.studentsCount,
            lessonsCount: c.lessons?.length || 0,
            duration: c.lessons?.reduce((acc: number, l: any) => {
                const mins = parseInt(l.duration) || 0;
                return acc + mins;
            }, 0) || 0,
            createdAt: c.createdAt,
        }));

        return NextResponse.json(mapped);
    } catch (error: any) {
        console.error('Courses fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { title, subtitle, description, category, level, language, lessons, price, isPublished } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const course = await Course.create({
            title,
            subtitle,
            description,
            category,
            level,
            language,
            instructor: session.user.id,
            lessons: lessons || [],
            price: price || 0,
            isPublished: isPublished || false,
        });

        return NextResponse.json(course, { status: 201 });
    } catch (error: any) {
        console.error('Course create error:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
