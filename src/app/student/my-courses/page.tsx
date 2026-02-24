'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    CheckCircle,
    Play,
    Search,
    Filter,
    Star,
    Trophy,
    TrendingUp,
    Loader2,
    X,
    Award
} from 'lucide-react';

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchMyCourses() {
            try {
                const res = await fetch('/api/student/my-courses');
                if (res.ok) {
                    const json = await res.json();
                    setCourses(json);
                }
            } catch (err) {
                console.error('Failed to fetch my courses:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchMyCourses();
    }, []);

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'completed' && course.progress >= 100) ||
            (filter === 'in-progress' && course.progress < 100);

        const matchesSearch = !searchQuery.trim() ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Stats
    const totalCourses = courses.length;
    const completedCourses = courses.filter(c => c.progress >= 100).length;
    const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100).length;
    const totalLessons = courses.reduce((acc, c) => acc + (c.completedLessons || 0), 0);

    const stats = [
        { icon: BookOpen, label: 'Total Enrolled', value: totalCourses, color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
        { icon: TrendingUp, label: 'In Progress', value: inProgressCourses, color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
        { icon: Trophy, label: 'Completed', value: completedCourses, color: 'from-[var(--success-400)] to-green-600' },
        { icon: CheckCircle, label: 'Lessons Done', value: totalLessons, color: 'from-purple-500 to-purple-700' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--primary-400)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Learning</h1>
                <p className="text-[var(--text-secondary)]">Track your enrolled courses and progress</p>
            </div>

            {/* Stats */}
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

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        placeholder="Search your courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10 w-full"
                    />
                </div>

                <div className="flex gap-2">
                    {(['all', 'in-progress', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : 'Completed'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses List */}
            {filteredCourses.length > 0 ? (
                <div className="space-y-4">
                    {filteredCourses.map((course) => (
                        <div key={course.enrollmentId} className="glass-card p-4 md:p-5">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Thumbnail */}
                                <div className="w-full md:w-40 h-28 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <BookOpen className="w-10 h-10 text-white/30" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-white line-clamp-1">{course.title}</h3>
                                        {course.certificate && (
                                            <span className="badge badge-success text-xs flex items-center gap-1 whitespace-nowrap">
                                                <Award className="w-3 h-3" /> Certificate
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] mb-2">{course.instructor}</p>

                                    {/* Category & Rating */}
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-3">
                                        <span className="badge badge-primary text-xs">{course.category}</span>
                                        {course.rating && (
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                                {course.rating}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="progress-bar h-2">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                                            {course.progress}% • {course.completedLessons}/{course.totalLessons}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-xs text-[var(--text-tertiary)]">
                                            {course.lastAccessedLesson
                                                ? `Last: ${course.lastAccessedLesson}`
                                                : `Enrolled ${new Date(course.enrolledAt).toLocaleDateString()}`}
                                        </p>
                                        <Link
                                            href={`/student/courses/${course.id}/learn`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            <Play className="w-4 h-4" />
                                            {course.progress >= 100 ? 'Review' : 'Continue'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <BookOpen className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {courses.length === 0 ? 'No enrolled courses' : 'No courses match your filter'}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                        {courses.length === 0
                            ? 'Explore our course catalog and start learning today!'
                            : 'Try adjusting your search or filter criteria'}
                    </p>
                    {courses.length === 0 ? (
                        <Link href="/student/courses" className="btn btn-primary">Browse Courses</Link>
                    ) : (
                        <button className="btn btn-secondary" onClick={() => { setFilter('all'); setSearchQuery(''); }}>
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
