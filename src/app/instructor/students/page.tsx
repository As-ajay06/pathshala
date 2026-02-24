'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    BookOpen,
    Clock,
    TrendingUp,
    CheckCircle,
    Loader2,
    Mail,
    BarChart3,
    Star
} from 'lucide-react';

export default function InstructorStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'inactive'>('all');

    useEffect(() => {
        async function fetchStudents() {
            try {
                const res = await fetch('/api/instructor/students');
                if (res.ok) {
                    const json = await res.json();
                    setStudents(json);
                }
            } catch (err) {
                console.error('Failed to fetch students:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => {
        const matchesFilter = filter === 'all' || s.status === filter;
        const matchesSearch = !searchQuery.trim() ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Stats
    const totalStudents = students.length;
    const uniqueStudents = new Set(students.map(s => s.studentId?.toString())).size;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const completedStudents = students.filter(s => s.status === 'completed').length;

    const stats = [
        { icon: Users, label: 'Total Enrollments', value: totalStudents, color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
        { icon: Star, label: 'Unique Students', value: uniqueStudents, color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
        { icon: TrendingUp, label: 'Active', value: activeStudents, color: 'from-[var(--success-400)] to-green-600' },
        { icon: CheckCircle, label: 'Completed', value: completedStudents, color: 'from-purple-500 to-purple-700' },
    ];

    const statusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-[var(--success-400)] bg-[var(--success-400)]/10';
            case 'completed': return 'text-blue-400 bg-blue-400/10';
            case 'inactive': return 'text-[var(--text-tertiary)] bg-[var(--text-tertiary)]/10';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--accent-400)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Students</h1>
                <p className="text-[var(--text-secondary)]">Manage and track your students</p>
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
                        placeholder="Search students or courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10 w-full"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'active', 'completed', 'inactive'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? 'btn-accent' : 'btn-ghost'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Students List */}
            {filteredStudents.length > 0 ? (
                <div className="space-y-3">
                    {filteredStudents.map((student) => (
                        <div key={student.enrollmentId} className="glass-card p-4 flex flex-col md:flex-row md:items-center gap-4">
                            {/* Student Info */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="avatar bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)]">
                                    {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-white truncate">{student.name}</p>
                                    <p className="text-xs text-[var(--text-tertiary)] truncate">{student.email}</p>
                                </div>
                            </div>

                            {/* Course */}
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <BookOpen className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                                <span className="text-sm text-[var(--text-secondary)] truncate">{student.courseTitle}</span>
                            </div>

                            {/* Progress */}
                            <div className="flex items-center gap-3 w-full md:w-40">
                                <div className="flex-1">
                                    <div className="progress-bar h-2">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${student.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">{student.progress}%</span>
                            </div>

                            {/* Status */}
                            <span className={`text-xs capitalize px-2 py-1 rounded-full whitespace-nowrap ${statusColor(student.status)}`}>
                                {student.status}
                            </span>

                            {/* Enrolled Date */}
                            <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                {new Date(student.enrolledAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Users className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {students.length === 0 ? 'No students yet' : 'No matches found'}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                        {students.length === 0
                            ? 'Students will appear here once they enroll in your courses.'
                            : 'Try adjusting your search or filter criteria.'}
                    </p>
                </div>
            )}
        </div>
    );
}
