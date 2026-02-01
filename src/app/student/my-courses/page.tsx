'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    BookOpen,
    Search,
    Play,
    Clock,
    CheckCircle,
    Star,
    Award,
    ChevronDown,
    Download,
    BarChart3,
    Calendar,
    Filter
} from 'lucide-react';

interface EnrolledCourse {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    lastAccessed: string;
    enrolledAt: string;
    category: string;
    rating?: number;
    certificate?: boolean;
    nextLesson?: string;
}

const mockCourses: EnrolledCourse[] = [
    {
        id: '1',
        title: 'Complete React Masterclass',
        instructor: 'Sarah Johnson',
        thumbnail: '/api/placeholder/320/180',
        progress: 65,
        totalLessons: 120,
        completedLessons: 78,
        lastAccessed: '2 hours ago',
        enrolledAt: '2025-12-15',
        category: 'Web Development',
        rating: 4.9,
        nextLesson: 'React Hooks Deep Dive',
    },
    {
        id: '2',
        title: 'Node.js Backend Development',
        instructor: 'Michael Chen',
        thumbnail: '/api/placeholder/320/180',
        progress: 100,
        totalLessons: 85,
        completedLessons: 85,
        lastAccessed: '1 week ago',
        enrolledAt: '2025-11-01',
        category: 'Backend',
        rating: 4.8,
        certificate: true,
    },
    {
        id: '3',
        title: 'JavaScript Essentials',
        instructor: 'Emily Rodriguez',
        thumbnail: '/api/placeholder/320/180',
        progress: 45,
        totalLessons: 60,
        completedLessons: 27,
        lastAccessed: '3 days ago',
        enrolledAt: '2026-01-05',
        category: 'Programming',
        nextLesson: 'Async/Await Patterns',
    },
    {
        id: '4',
        title: 'TypeScript Mastery',
        instructor: 'David Park',
        thumbnail: '/api/placeholder/320/180',
        progress: 20,
        totalLessons: 50,
        completedLessons: 10,
        lastAccessed: '1 day ago',
        enrolledAt: '2026-01-20',
        category: 'Programming',
        nextLesson: 'Generics & Utility Types',
    },
    {
        id: '5',
        title: 'Python for Data Science',
        instructor: 'Dr. Lisa Wang',
        thumbnail: '/api/placeholder/320/180',
        progress: 10,
        totalLessons: 75,
        completedLessons: 8,
        lastAccessed: '5 days ago',
        enrolledAt: '2026-01-18',
        category: 'Data Science',
        nextLesson: 'NumPy Fundamentals',
    },
];

function MyCoursesContent() {
    const searchParams = useSearchParams();
    const [courses] = useState<EnrolledCourse[]>(mockCourses);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'title'>('recent');
    const [showEnrollmentSuccess, setShowEnrollmentSuccess] = useState(false);

    // Check for enrollment success
    useEffect(() => {
        const enrolled = searchParams.get('enrolled');
        if (enrolled === 'true') {
            setShowEnrollmentSuccess(true);
            setTimeout(() => setShowEnrollmentSuccess(false), 5000);
        }
    }, [searchParams]);

    const filteredCourses = courses
        .filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'completed' && c.progress === 100) ||
                (statusFilter === 'in-progress' && c.progress < 100);
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'progress': return b.progress - a.progress;
                case 'title': return a.title.localeCompare(b.title);
                default: return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
            }
        });

    const stats = {
        total: courses.length,
        inProgress: courses.filter(c => c.progress < 100 && c.progress > 0).length,
        completed: courses.filter(c => c.progress === 100).length,
        notStarted: courses.filter(c => c.progress === 0).length,
    };

    // Find the course to continue (most recently accessed with progress < 100)
    const continueWatching = courses
        .filter(c => c.progress < 100 && c.progress > 0)
        .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())[0];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Enrollment Success Banner */}
            {showEnrollmentSuccess && (
                <div className="mb-6 p-4 bg-[var(--success-500)]/20 border border-[var(--success-500)]/30 rounded-xl flex items-center gap-3 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                    <p className="text-[var(--success-400)]">
                        🎉 Congratulations! You've successfully enrolled in the course. Start learning now!
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">My Courses</h1>
                    <p className="text-[var(--text-secondary)]">
                        Continue learning where you left off
                    </p>
                </div>
                <Link href="/student/courses" className="btn btn-accent">
                    <BookOpen className="w-4 h-4" />
                    Browse More Courses
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Enrolled Courses</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Play className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.completed}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{courses.filter(c => c.certificate).length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Certificates</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Watching */}
            {continueWatching && (
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-[var(--accent-400)]" />
                        Continue Watching
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-80 aspect-video bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] rounded-xl flex items-center justify-center relative overflow-hidden group">
                            <BookOpen className="w-16 h-16 text-white/20" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Link href={`/learn/${continueWatching.id}`} className="btn btn-accent">
                                    <Play className="w-4 h-4" />
                                    Resume
                                </Link>
                            </div>
                            {/* Progress Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                                <div
                                    className="h-full bg-[var(--accent-500)]"
                                    style={{ width: `${continueWatching.progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-xs text-[var(--primary-400)] font-medium">{continueWatching.category}</span>
                            <h3 className="text-xl font-semibold text-white mt-1 mb-2">{continueWatching.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">by {continueWatching.instructor}</p>

                            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {continueWatching.completedLessons}/{continueWatching.totalLessons} lessons
                                </span>
                                <span className="flex items-center gap-1">
                                    <BarChart3 className="w-4 h-4" />
                                    {continueWatching.progress}% complete
                                </span>
                            </div>

                            {continueWatching.nextLesson && (
                                <div className="p-3 bg-[var(--surface-glass)] rounded-lg">
                                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Next Lesson</p>
                                    <p className="text-sm text-white">{continueWatching.nextLesson}</p>
                                </div>
                            )}

                            <Link href={`/learn/${continueWatching.id}`} className="btn btn-primary mt-4">
                                <Play className="w-4 h-4" />
                                Continue Learning
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="input pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'in-progress', 'completed'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-[var(--accent-500)] text-white'
                                    : 'bg-[var(--surface-glass)] text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <select
                            className="input appearance-none cursor-pointer pr-10"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        >
                            <option value="recent">Recently Enrolled</option>
                            <option value="progress">By Progress</option>
                            <option value="title">By Title</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <BookOpen className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No courses found</h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                        {searchQuery ? 'Try a different search term' : 'Start your learning journey today!'}
                    </p>
                    <Link href="/student/courses" className="btn btn-primary">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="glass-card overflow-hidden hover:border-[var(--border-strong)] transition-all group">
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)]">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-white/20" />
                                </div>
                                {course.progress === 100 && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--success-500)] text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Completed
                                    </div>
                                )}
                                {course.progress > 0 && course.progress < 100 && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--accent-500)] text-white text-xs font-semibold rounded-lg">
                                        {course.progress}%
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Link href={`/learn/${course.id}`} className="btn btn-accent">
                                        <Play className="w-4 h-4" />
                                        {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Continue'}
                                    </Link>
                                </div>
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)]"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-[var(--primary-500)]/20 text-[var(--primary-400)] text-xs rounded">
                                        {course.category}
                                    </span>
                                    {course.rating && (
                                        <span className="flex items-center gap-1 text-xs text-[var(--warning-400)]">
                                            <Star className="w-3 h-3 fill-current" />
                                            {course.rating}
                                        </span>
                                    )}
                                </div>

                                <Link href={`/learn/${course.id}`}>
                                    <h3 className="text-lg font-semibold text-white mb-1 hover:text-[var(--primary-400)] transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                </Link>
                                <p className="text-sm text-[var(--text-tertiary)] mb-3">by {course.instructor}</p>

                                {/* Progress Info */}
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-[var(--text-secondary)]">
                                        {course.completedLessons}/{course.totalLessons} lessons
                                    </span>
                                    <span className="text-[var(--text-tertiary)]">
                                        Last: {course.lastAccessed}
                                    </span>
                                </div>

                                {/* Next Lesson or Certificate */}
                                {course.progress === 100 && course.certificate ? (
                                    <button className="w-full flex items-center justify-center gap-2 p-3 bg-[var(--success-500)]/20 text-[var(--success-400)] rounded-lg text-sm font-medium hover:bg-[var(--success-500)]/30 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Download Certificate
                                    </button>
                                ) : course.nextLesson ? (
                                    <div className="p-3 bg-[var(--surface-glass)] rounded-lg">
                                        <p className="text-xs text-[var(--text-tertiary)] mb-1">Next Up</p>
                                        <p className="text-sm text-white truncate">{course.nextLesson}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function MyCoursesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <MyCoursesContent />
        </Suspense>
    );
}
