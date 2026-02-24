'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    BookOpen,
    Trophy,
    CheckCircle,
    Clock,
    TrendingUp,
    Flame,
    Loader2,
    Play,
    Star,
    Award
} from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/student/my-courses');
                if (res.ok) {
                    const json = await res.json();
                    setCourses(json);
                }
            } catch (err) {
                console.error('Failed to fetch progress:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Compute stats from real data
    const totalLessonsCompleted = courses.reduce((acc, c) => acc + (c.completedLessons || 0), 0);
    const coursesCompleted = courses.filter(c => c.progress >= 100).length;
    const coursesInProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
    const certificates = coursesCompleted;
    const avgProgress = courses.length > 0
        ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length)
        : 0;

    const stats = [
        { icon: CheckCircle, label: 'Lessons Completed', value: totalLessonsCompleted, color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
        { icon: Trophy, label: 'Courses Completed', value: coursesCompleted, color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
        { icon: TrendingUp, label: 'In Progress', value: coursesInProgress, color: 'from-[var(--success-400)] to-green-600' },
        { icon: Award, label: 'Certificates', value: certificates, color: 'from-purple-500 to-purple-700' },
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
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Progress</h1>
                <p className="text-[var(--text-secondary)]">Track your learning journey</p>
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

            {/* Overall Progress */}
            {courses.length > 0 && (
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Overall Progress</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="progress-bar h-3 rounded-full">
                                <div
                                    className="progress-bar-fill rounded-full"
                                    style={{ width: `${avgProgress}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-lg font-bold text-white">{avgProgress}%</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                        Average across {courses.length} enrolled course{courses.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* Course Progress List */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Course Progress</h2>
                {courses.length > 0 ? (
                    <div className="space-y-4">
                        {courses.map((course) => (
                            <div key={course.enrollmentId} className="glass-card p-4 md:p-5">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-white truncate">{course.title}</h3>
                                            {course.progress >= 100 && (
                                                <span className="badge badge-success text-xs whitespace-nowrap">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Complete
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">{course.instructor}</p>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="progress-bar h-2">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-white whitespace-nowrap">{course.progress}%</span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-tertiary)]">
                                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                                            {course.category && <span className="badge badge-primary text-xs">{course.category}</span>}
                                        </div>
                                    </div>

                                    <Link
                                        href={`/student/courses/${course.id}/learn`}
                                        className="btn btn-sm btn-primary self-end md:self-center"
                                    >
                                        <Play className="w-4 h-4" />
                                        {course.progress >= 100 ? 'Review' : 'Continue'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center">
                        <BarChart3 className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No progress to show</h3>
                        <p className="text-[var(--text-secondary)] mb-4">Enroll in courses to start tracking your progress!</p>
                        <Link href="/student/courses" className="btn btn-primary">Browse Courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
