'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Search,
    Filter,
    Download,
    Mail,
    MoreVertical,
    ChevronDown,
    Star,
    BookOpen,
    Clock,
    TrendingUp,
    Award,
    MessageSquare,
    Eye,
    Ban,
    CheckCircle,
    XCircle,
    Calendar,
    BarChart3,
    UserPlus,
    GraduationCap
} from 'lucide-react';

interface Student {
    id: string;
    name: string;
    email: string;
    avatar: string;
    enrolledCourses: number;
    completedCourses: number;
    totalSpent: number;
    joinedAt: string;
    lastActive: string;
    progress: number;
    status: 'active' | 'inactive' | 'blocked';
    rating?: number;
}

interface CourseEnrollment {
    courseId: string;
    courseTitle: string;
    progress: number;
    enrolledAt: string;
    lastAccessed: string;
}

const mockStudents: Student[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD',
        enrolledCourses: 3,
        completedCourses: 1,
        totalSpent: 299,
        joinedAt: '2025-12-15',
        lastActive: '2 hours ago',
        progress: 65,
        status: 'active',
        rating: 4.8,
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: 'JS',
        enrolledCourses: 2,
        completedCourses: 2,
        totalSpent: 199,
        joinedAt: '2025-11-20',
        lastActive: '1 day ago',
        progress: 100,
        status: 'active',
        rating: 5.0,
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        avatar: 'MJ',
        enrolledCourses: 4,
        completedCourses: 0,
        totalSpent: 499,
        joinedAt: '2026-01-05',
        lastActive: '5 hours ago',
        progress: 25,
        status: 'active',
    },
    {
        id: '4',
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        avatar: 'SW',
        enrolledCourses: 1,
        completedCourses: 0,
        totalSpent: 99,
        joinedAt: '2026-01-10',
        lastActive: '3 days ago',
        progress: 45,
        status: 'inactive',
    },
    {
        id: '5',
        name: 'Alex Brown',
        email: 'alex.brown@example.com',
        avatar: 'AB',
        enrolledCourses: 2,
        completedCourses: 1,
        totalSpent: 249,
        joinedAt: '2025-10-08',
        lastActive: '1 week ago',
        progress: 80,
        status: 'inactive',
        rating: 4.5,
    },
    {
        id: '6',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        avatar: 'ED',
        enrolledCourses: 5,
        completedCourses: 3,
        totalSpent: 599,
        joinedAt: '2025-09-15',
        lastActive: '30 minutes ago',
        progress: 90,
        status: 'active',
        rating: 4.9,
    },
];

export default function StudentsPage() {
    const [students] = useState<Student[]>(mockStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'progress' | 'spent' | 'joinedAt'>('name');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const filteredStudents = students
        .filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'progress': return b.progress - a.progress;
                case 'spent': return b.totalSpent - a.totalSpent;
                case 'joinedAt': return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
                default: return a.name.localeCompare(b.name);
            }
        });

    const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'active').length,
        avgProgress: Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length),
        totalRevenue: students.reduce((acc, s) => acc + s.totalSpent, 0),
    };

    const getStatusColor = (status: Student['status']) => {
        switch (status) {
            case 'active': return 'bg-[var(--success-500)]/20 text-[var(--success-400)]';
            case 'inactive': return 'bg-[var(--warning-500)]/20 text-[var(--warning-400)]';
            case 'blocked': return 'bg-[var(--error-500)]/20 text-[var(--error-400)]';
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Students</h1>
                    <p className="text-[var(--text-secondary)]">
                        Manage and track your enrolled students
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="btn btn-accent">
                        <Mail className="w-4 h-4" />
                        Email All
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Students</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.active}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Active Students</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.avgProgress}%</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Avg Progress</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            placeholder="Search students by name or email..."
                            className="input pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'active', 'inactive'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                                    ? 'bg-[var(--accent-500)] text-white'
                                    : 'bg-[var(--surface-glass)] text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <select
                            className="input appearance-none cursor-pointer pr-10"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="progress">Sort by Progress</option>
                            <option value="spent">Sort by Revenue</option>
                            <option value="joinedAt">Sort by Join Date</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)]">
                                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Student</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Courses</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Progress</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Revenue</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Last Active</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                                <th className="text-right py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-glass)] transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white font-semibold text-sm">
                                                {student.avatar}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{student.name}</p>
                                                <p className="text-xs text-[var(--text-tertiary)]">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4 text-[var(--text-tertiary)]" />
                                            <span className="text-white">{student.enrolledCourses}</span>
                                            <span className="text-[var(--text-tertiary)]">enrolled</span>
                                        </div>
                                        <p className="text-xs text-[var(--success-400)]">{student.completedCourses} completed</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-[var(--surface-glass)] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] rounded-full"
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-white">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-white font-medium">${student.totalSpent}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-[var(--text-secondary)]">{student.lastActive}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No students found</h3>
                        <p className="text-[var(--text-secondary)]">
                            {searchQuery ? 'Try a different search term' : 'Students will appear here when they enroll'}
                        </p>
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStudent(null)}>
                    <div className="glass-card p-6 max-w-lg w-full animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white font-bold text-xl">
                                    {selectedStudent.avatar}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{selectedStudent.name}</h3>
                                    <p className="text-[var(--text-secondary)]">{selectedStudent.email}</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.status)}`}>
                                        {selectedStudent.status}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="text-[var(--text-tertiary)] hover:text-white text-2xl">
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                                <p className="text-xs text-[var(--text-tertiary)] mb-1">Enrolled Courses</p>
                                <p className="text-2xl font-bold text-white">{selectedStudent.enrolledCourses}</p>
                            </div>
                            <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                                <p className="text-xs text-[var(--text-tertiary)] mb-1">Completed</p>
                                <p className="text-2xl font-bold text-[var(--success-400)]">{selectedStudent.completedCourses}</p>
                            </div>
                            <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                                <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Spent</p>
                                <p className="text-2xl font-bold text-white">${selectedStudent.totalSpent}</p>
                            </div>
                            <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                                <p className="text-xs text-[var(--text-tertiary)] mb-1">Overall Progress</p>
                                <p className="text-2xl font-bold text-[var(--accent-400)]">{selectedStudent.progress}%</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Joined</span>
                                <span className="text-white">{new Date(selectedStudent.joinedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Last Active</span>
                                <span className="text-white">{selectedStudent.lastActive}</span>
                            </div>
                            {selectedStudent.rating && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Average Rating Given</span>
                                    <span className="flex items-center gap-1 text-white">
                                        <Star className="w-4 h-4 text-[var(--warning-400)] fill-current" />
                                        {selectedStudent.rating}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 btn btn-secondary">
                                <Mail className="w-4 h-4" />
                                Send Email
                            </button>
                            <button className="flex-1 btn btn-primary">
                                <BarChart3 className="w-4 h-4" />
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
