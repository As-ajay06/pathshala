'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
    Video,
    Loader2
} from 'lucide-react';

interface DashboardData {
    enrolledCourses: any[];
    recommendedCourses: any[];
    stats: {
        totalEnrolled: number;
        completedCourses: number;
        totalLessonsCompleted: number;
        certificates: number;
    };
}

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await fetch('/api/student/dashboard');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    const userName = session?.user?.name?.split(' ')[0] || 'Student';

    const stats = [
        { icon: BookOpen, label: 'Enrolled Courses', value: data?.stats.totalEnrolled || 0, color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
        { icon: Clock, label: 'Lessons Done', value: data?.stats.totalLessonsCompleted || 0, color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
        { icon: Trophy, label: 'Certificates', value: data?.stats.certificates || 0, color: 'from-[var(--success-400)] to-green-600' },
        { icon: TrendingUp, label: 'Completed', value: data?.stats.completedCourses || 0, color: 'from-purple-500 to-purple-700' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--primary-400)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in ">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Welcome back, {userName}! 👋
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

                    {data?.enrolledCourses && data.enrolledCourses.length > 0 ? (
                        <div className="space-y-4">
                            {data.enrolledCourses.slice(0, 3).map((course) => (
                                <div key={course.courseId} className="glass-card p-4 flex gap-4">
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
                                        href={`/student/courses/${course.courseId}/learn`}
                                        className="btn btn-sm btn-primary self-center hidden md:flex"
                                    >
                                        <Play className="w-4 h-4" />
                                        Continue
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center">
                            <BookOpen className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
                            <p className="text-[var(--text-secondary)] mb-4">Start your learning journey by enrolling in a course!</p>
                            <Link href="/student/courses" className="btn btn-primary">Browse Courses</Link>
                        </div>
                    )}

                    {/* AI Recommendations */}
                    {data?.recommendedCourses && data.recommendedCourses.length > 0 && (
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
                                {data.recommendedCourses.map((course) => (
                                    <Link key={course._id} href={`/student/courses/${course._id}`} className="course-card">
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
                                                    <span className="text-xs text-white">{course.rating || 0}</span>
                                                    <span className="text-xs text-[var(--text-tertiary)]">({((course.studentsCount || 0) / 1000).toFixed(1)}k)</span>
                                                </div>
                                                <span className="text-sm font-bold text-white">₹{course.price}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Achievement Card */}
                    <div className="glass-card p-5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-[var(--accent-500)]/20 to-transparent rounded-full blur-2xl" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)] flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        {(data?.stats.completedCourses || 0) > 0 ? 'Great Progress!' : 'Get Started!'}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        {(data?.stats.completedCourses || 0) > 0 ? "You're on a roll" : 'Enroll in your first course'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                {data?.stats.totalEnrolled
                                    ? `You've completed ${data.stats.totalLessonsCompleted} lessons across ${data.stats.totalEnrolled} courses!`
                                    : 'Start learning to track your progress here.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
