'use client';

import Link from 'next/link';
import {
    BookOpen,
    Clock,
    Trophy,
    TrendingUp,
    Play,
    ArrowRight,
    Star,
    Calendar,
    CheckCircle,
    Sparkles,
    Users,
    Video
} from 'lucide-react';

// Mock data - will be replaced with Supabase queries
const enrolledCourses = [
    {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        instructor: 'Sarah Johnson',
        thumbnail: '/api/placeholder/400/225',
        progress: 68,
        lastLesson: 'CSS Flexbox Deep Dive',
        totalLessons: 24,
        completedLessons: 16,
    },
    {
        id: '2',
        title: 'React & Next.js Masterclass',
        instructor: 'Mike Chen',
        thumbnail: '/api/placeholder/400/225',
        progress: 42,
        lastLesson: 'State Management',
        totalLessons: 36,
        completedLessons: 15,
    },
    {
        id: '3',
        title: 'Python for Data Science',
        instructor: 'Dr. Emily Davis',
        thumbnail: '/api/placeholder/400/225',
        progress: 25,
        lastLesson: 'NumPy Basics',
        totalLessons: 28,
        completedLessons: 7,
    },
];

const recommendedCourses = [
    {
        id: '4',
        title: 'Advanced TypeScript Patterns',
        instructor: 'Alex Morgan',
        rating: 4.9,
        students: 5200,
        price: 79.99,
        category: 'Development',
    },
    {
        id: '5',
        title: 'UI/UX Design Fundamentals',
        instructor: 'Jessica Lee',
        rating: 4.8,
        students: 8900,
        price: 69.99,
        category: 'Design',
    },
    {
        id: '6',
        title: 'Machine Learning with Python',
        instructor: 'Dr. James Wilson',
        rating: 4.9,
        students: 12000,
        price: 129.99,
        category: 'Data Science',
    },
];

const upcomingEvents = [
    {
        id: '1',
        title: 'Live Q&A: JavaScript Best Practices',
        instructor: 'Sarah Johnson',
        time: '2:00 PM Today',
        type: 'Live Session',
    },
    {
        id: '2',
        title: 'Quiz: React Fundamentals',
        course: 'React & Next.js Masterclass',
        time: 'Due Tomorrow',
        type: 'Quiz',
    },
    {
        id: '3',
        title: 'Assignment: Build a Dashboard',
        course: 'Complete Web Development',
        time: 'Due in 3 days',
        type: 'Assignment',
    },
];

const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '6', color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
    { icon: Clock, label: 'Hours Learned', value: '48', color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
    { icon: Trophy, label: 'Certificates', value: '2', color: 'from-[var(--success-400)] to-green-600' },
    { icon: TrendingUp, label: 'Current Streak', value: '12 days', color: 'from-purple-500 to-purple-700' },
];

export default function StudentDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Welcome back, John! 👋
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Continue your learning journey where you left off
                    </p>
                </div>
                <Link href="/student/courses" className="btn btn-primary">
                    <Sparkles className="w-4 h-4" />
                    Explore New Courses
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="stat-value">{stat.value}</p>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Continue Learning Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
                        <Link href="/student/my-courses" className="text-sm text-[var(--primary-400)] hover:underline flex items-center gap-1">
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {enrolledCourses.map((course) => (
                            <div key={course.id} className="glass-card p-4 flex gap-4">
                                <div className="w-24 h-16 md:w-32 md:h-20 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-8 h-8 text-white/30" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{course.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mb-2">{course.instructor}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="progress-bar h-2">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                                            {course.progress}% • {course.completedLessons}/{course.totalLessons} lessons
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/student/courses/${course.id}/learn`}
                                    className="btn btn-sm btn-primary self-center hidden md:flex"
                                >
                                    <Play className="w-4 h-4" />
                                    Continue
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* AI Recommendations */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[var(--accent-400)]" />
                                <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
                            </div>
                            <Link href="/student/courses" className="text-sm text-[var(--primary-400)] hover:underline flex items-center gap-1">
                                See more
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {recommendedCourses.map((course) => (
                                <Link key={course.id} href={`/student/courses/${course.id}`} className="course-card">
                                    <div className="h-32 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-600)] flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-white/20" />
                                    </div>
                                    <div className="p-4">
                                        <span className="badge badge-primary text-xs mb-2">{course.category}</span>
                                        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{course.title}</h3>
                                        <p className="text-xs text-[var(--text-secondary)] mb-2">{course.instructor}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                                <span className="text-xs text-white">{course.rating}</span>
                                                <span className="text-xs text-[var(--text-tertiary)]">({(course.students / 1000).toFixed(1)}k)</span>
                                            </div>
                                            <span className="text-sm font-bold text-white">${course.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Events */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[var(--primary-400)]" />
                            <h3 className="font-semibold text-white">Upcoming</h3>
                        </div>

                        <div className="space-y-3">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={event.id}
                                    className={`p-3 rounded-lg bg-[var(--surface-glass)] border border-[var(--border-subtle)] ${index === 0 ? 'border-l-2 border-l-[var(--primary-500)]' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${event.type === 'Live Session'
                                                ? 'bg-[var(--error-500)]/20 text-[var(--error-400)]'
                                                : event.type === 'Quiz'
                                                    ? 'bg-[var(--accent-500)]/20 text-[var(--accent-400)]'
                                                    : 'bg-[var(--primary-500)]/20 text-[var(--primary-400)]'
                                            }`}>
                                            {event.type === 'Live Session' ? (
                                                <Video className="w-4 h-4" />
                                            ) : event.type === 'Quiz' ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <BookOpen className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{event.title}</p>
                                            <p className="text-xs text-[var(--text-tertiary)]">{event.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 text-sm text-[var(--primary-400)] hover:underline">
                            View full schedule
                        </button>
                    </div>

                    {/* Achievement Card */}
                    <div className="glass-card p-5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-[var(--accent-500)]/20 to-transparent rounded-full blur-2xl" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)] flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Great Progress!</p>
                                    <p className="text-xs text-[var(--text-secondary)]">You're on a roll</p>
                                </div>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Complete 2 more lessons to earn the "Consistent Learner" badge!
                            </p>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: '80%' }} />
                            </div>
                            <p className="text-xs text-[var(--text-tertiary)] mt-2">8 of 10 lessons completed</p>
                        </div>
                    </div>

                    {/* Learning Streak */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">12 Day Streak! 🔥</h3>
                            <span className="text-xs text-[var(--text-tertiary)]">Best: 21 days</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-6 rounded ${i < 12 ? 'bg-[var(--primary-500)]' : 'bg-[var(--surface-glass)]'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-3">
                            Keep learning daily to maintain your streak!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
