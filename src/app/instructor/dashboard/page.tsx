'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    BookOpen,
    Users,
    DollarSign,
    Star,
    TrendingUp,
    Plus,
    ArrowRight,
    Loader2,
    BarChart3,
    Eye
} from 'lucide-react';

export default function InstructorDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await fetch('/api/instructor/dashboard');
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

    const userName = session?.user?.name?.split(' ')[0] || 'Instructor';

    const stats = [
        { icon: BookOpen, label: 'Total Courses', value: data?.stats.totalCourses || 0, color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
        { icon: Users, label: 'Total Students', value: data?.stats.totalStudents || 0, color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
        { icon: DollarSign, label: 'Total Earnings', value: `₹${(data?.stats.totalEarnings || 0).toLocaleString()}`, color: 'from-[var(--success-400)] to-green-600' },
        { icon: Star, label: 'Avg Rating', value: data?.stats.avgRating || 0, color: 'from-purple-500 to-purple-700' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--accent-400)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Welcome back, {userName}! 🎓
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Here's an overview of your teaching activity
                    </p>
                </div>
                <Link href="/instructor/courses/create" className="btn btn-accent">
                    <Plus className="w-4 h-4" />
                    Create New Course
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

            {/* Courses Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">My Courses</h2>
                    <Link href="/instructor/courses" className="text-sm text-[var(--accent-400)] hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {data?.courses && data.courses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.courses.slice(0, 6).map((course: any) => (
                            <div key={course._id} className="glass-card overflow-hidden">
                                <div className="h-32 bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-800)] flex items-center justify-center relative">
                                    <BookOpen className="w-12 h-12 text-white/20" />
                                    <span className={`absolute top-3 right-3 badge text-xs ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                        {course.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {course.studentsCount} students
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                            {course.rating || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                                        <span className="text-sm font-semibold text-[var(--success-400)]">
                                            ₹{(course.revenue || 0).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-[var(--text-tertiary)]">
                                            {course.lessonsCount} lessons
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-8 text-center">
                        <BookOpen className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
                        <p className="text-[var(--text-secondary)] mb-4">Create your first course to start teaching!</p>
                        <Link href="/instructor/courses/create" className="btn btn-accent">
                            <Plus className="w-4 h-4" /> Create Course
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
