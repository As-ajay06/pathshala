'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FileQuestion,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    Eye,
    Play,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    BarChart3,
    ChevronDown,
    BookOpen,
    Target,
    Award,
    TrendingUp,
    Zap,
    HelpCircle,
    List,
    Settings
} from 'lucide-react';

interface Quiz {
    id: string;
    title: string;
    description: string;
    course?: string;
    questionsCount: number;
    duration: number; // in minutes
    passingScore: number;
    attempts: number;
    avgScore: number;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    lastModified: string;
}

interface Question {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    points: number;
}

const mockQuizzes: Quiz[] = [
    {
        id: '1',
        title: 'React Fundamentals Assessment',
        description: 'Test your knowledge of React basics including components, props, and state.',
        course: 'Complete React Masterclass',
        questionsCount: 20,
        duration: 30,
        passingScore: 70,
        attempts: 156,
        avgScore: 78,
        status: 'published',
        createdAt: '2025-12-15',
        lastModified: '2026-01-20',
    },
    {
        id: '2',
        title: 'Advanced Hooks Quiz',
        description: 'Deep dive into React hooks including useEffect, useContext, and custom hooks.',
        course: 'Complete React Masterclass',
        questionsCount: 15,
        duration: 25,
        passingScore: 75,
        attempts: 89,
        avgScore: 72,
        status: 'published',
        createdAt: '2026-01-05',
        lastModified: '2026-01-18',
    },
    {
        id: '3',
        title: 'Node.js Basics Test',
        description: 'Evaluate understanding of Node.js runtime, modules, and basic server concepts.',
        course: 'Node.js Backend Development',
        questionsCount: 25,
        duration: 40,
        passingScore: 65,
        attempts: 67,
        avgScore: 81,
        status: 'published',
        createdAt: '2025-11-20',
        lastModified: '2026-01-15',
    },
    {
        id: '4',
        title: 'JavaScript ES6+ Features',
        description: 'Test knowledge of modern JavaScript features.',
        course: 'JavaScript Essentials',
        questionsCount: 30,
        duration: 45,
        passingScore: 70,
        attempts: 0,
        avgScore: 0,
        status: 'draft',
        createdAt: '2026-01-22',
        lastModified: '2026-01-22',
    },
    {
        id: '5',
        title: 'TypeScript Generics Challenge',
        description: 'Advanced quiz on TypeScript generics and utility types.',
        course: 'TypeScript Mastery',
        questionsCount: 10,
        duration: 20,
        passingScore: 80,
        attempts: 45,
        avgScore: 65,
        status: 'published',
        createdAt: '2025-10-01',
        lastModified: '2025-12-10',
    },
];

export default function QuizzesPage() {
    const [quizzes] = useState<Quiz[]>(mockQuizzes);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
    const [sortBy, setSortBy] = useState<'title' | 'attempts' | 'avgScore' | 'createdAt'>('createdAt');

    const filteredQuizzes = quizzes
        .filter(q => {
            const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'attempts': return b.attempts - a.attempts;
                case 'avgScore': return b.avgScore - a.avgScore;
                case 'createdAt': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default: return a.title.localeCompare(b.title);
            }
        });

    const stats = {
        total: quizzes.length,
        published: quizzes.filter(q => q.status === 'published').length,
        totalAttempts: quizzes.reduce((acc, q) => acc + q.attempts, 0),
        avgScore: Math.round(quizzes.filter(q => q.attempts > 0).reduce((acc, q) => acc + q.avgScore, 0) / quizzes.filter(q => q.attempts > 0).length) || 0,
    };

    const getStatusColor = (status: Quiz['status']) => {
        switch (status) {
            case 'published': return 'bg-[var(--success-500)]/20 text-[var(--success-400)]';
            case 'draft': return 'bg-[var(--warning-500)]/20 text-[var(--warning-400)]';
            case 'archived': return 'bg-[var(--text-tertiary)]/20 text-[var(--text-tertiary)]';
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Quizzes</h1>
                    <p className="text-[var(--text-secondary)]">
                        Create and manage quizzes for your courses
                    </p>
                </div>
                <Link href="/instructor/quizzes/create" className="btn btn-accent">
                    <Plus className="w-4 h-4" />
                    Create Quiz
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <FileQuestion className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Quizzes</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.published}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Published</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.totalAttempts}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Attempts</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.avgScore}%</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Avg Score</p>
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
                            placeholder="Search quizzes..."
                            className="input pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'published', 'draft'] as const).map((status) => (
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
                            <option value="createdAt">Sort by Date</option>
                            <option value="title">Sort by Title</option>
                            <option value="attempts">Sort by Attempts</option>
                            <option value="avgScore">Sort by Avg Score</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Quizzes Grid */}
            {filteredQuizzes.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FileQuestion className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No quizzes found</h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                        {searchQuery ? 'Try a different search term' : 'Create your first quiz to get started'}
                    </p>
                    <Link href="/instructor/quizzes/create" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Create Quiz
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz.id} className="glass-card p-5 hover:border-[var(--border-strong)] transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                                    {quiz.status}
                                </span>
                                <div className="relative group">
                                    <button className="p-1.5 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    <div className="absolute right-0 top-full mt-1 w-40 glass-card p-2 hidden group-hover:block z-10">
                                        <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                            <Copy className="w-4 h-4" />
                                            Duplicate
                                        </button>
                                        <Link href={`/instructor/quizzes/${quiz.id}/analytics`} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                            <BarChart3 className="w-4 h-4" />
                                            Analytics
                                        </Link>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--error-400)] rounded-lg hover:bg-[var(--error-500)]/10">
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/instructor/quizzes/${quiz.id}`}>
                                <h3 className="text-lg font-semibold text-white mb-2 hover:text-[var(--primary-400)] transition-colors">
                                    {quiz.title}
                                </h3>
                            </Link>

                            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                {quiz.description}
                            </p>

                            {quiz.course && (
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-4 h-4 text-[var(--primary-400)]" />
                                    <span className="text-sm text-[var(--primary-400)]">{quiz.course}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="text-center p-2 bg-[var(--surface-glass)] rounded-lg">
                                    <HelpCircle className="w-4 h-4 text-[var(--text-tertiary)] mx-auto mb-1" />
                                    <p className="text-sm font-semibold text-white">{quiz.questionsCount}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">Questions</p>
                                </div>
                                <div className="text-center p-2 bg-[var(--surface-glass)] rounded-lg">
                                    <Clock className="w-4 h-4 text-[var(--text-tertiary)] mx-auto mb-1" />
                                    <p className="text-sm font-semibold text-white">{quiz.duration}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">Minutes</p>
                                </div>
                                <div className="text-center p-2 bg-[var(--surface-glass)] rounded-lg">
                                    <Target className="w-4 h-4 text-[var(--text-tertiary)] mx-auto mb-1" />
                                    <p className="text-sm font-semibold text-white">{quiz.passingScore}%</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">To Pass</p>
                                </div>
                            </div>

                            {quiz.status === 'published' && quiz.attempts > 0 && (
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                                            <Users className="w-4 h-4" />
                                            {quiz.attempts} attempts
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className={`w-4 h-4 ${quiz.avgScore >= quiz.passingScore ? 'text-[var(--success-400)]' : 'text-[var(--warning-400)]'}`} />
                                        <span className={`text-sm font-medium ${quiz.avgScore >= quiz.passingScore ? 'text-[var(--success-400)]' : 'text-[var(--warning-400)]'}`}>
                                            {quiz.avgScore}% avg
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4">
                                <Link href={`/instructor/quizzes/${quiz.id}`} className="flex-1 btn btn-secondary btn-sm">
                                    <Eye className="w-4 h-4" />
                                    View
                                </Link>
                                <Link href={`/instructor/quizzes/${quiz.id}/edit`} className="flex-1 btn btn-primary btn-sm">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
