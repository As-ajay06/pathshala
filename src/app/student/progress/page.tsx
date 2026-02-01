'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    Clock,
    Target,
    Award,
    BookOpen,
    Play,
    CheckCircle,
    Calendar,
    Flame,
    Star,
    ChevronRight,
    Trophy,
    Zap
} from 'lucide-react';

interface LearningStats {
    totalHours: number;
    coursesCompleted: number;
    coursesInProgress: number;
    certificatesEarned: number;
    currentStreak: number;
    longestStreak: number;
    lessonsCompleted: number;
    quizzesPassed: number;
}

interface WeeklyProgress {
    day: string;
    hours: number;
}

interface RecentActivity {
    id: string;
    type: 'lesson' | 'quiz' | 'certificate' | 'course';
    title: string;
    course: string;
    date: string;
    result?: string;
}

const mockStats: LearningStats = {
    totalHours: 156,
    coursesCompleted: 3,
    coursesInProgress: 4,
    certificatesEarned: 3,
    currentStreak: 12,
    longestStreak: 28,
    lessonsCompleted: 245,
    quizzesPassed: 18,
};

const weeklyProgress: WeeklyProgress[] = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 0.5 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 4.5 },
    { day: 'Sun', hours: 3.0 },
];

const recentActivity: RecentActivity[] = [
    { id: '1', type: 'lesson', title: 'React Hooks Deep Dive', course: 'Complete React Masterclass', date: '2 hours ago' },
    { id: '2', type: 'quiz', title: 'JavaScript Fundamentals Quiz', course: 'JavaScript Essentials', date: '5 hours ago', result: '92%' },
    { id: '3', type: 'lesson', title: 'State Management with Redux', course: 'Complete React Masterclass', date: 'Yesterday' },
    { id: '4', type: 'certificate', title: 'Node.js Backend Development', course: 'Node.js Backend Development', date: '3 days ago' },
    { id: '5', type: 'lesson', title: 'API Design Best Practices', course: 'Node.js Backend Development', date: '4 days ago' },
];

const courseProgress = [
    { id: '1', title: 'Complete React Masterclass', progress: 65, lessons: '78/120', lastAccessed: 'Today' },
    { id: '2', title: 'JavaScript Essentials', progress: 45, lessons: '27/60', lastAccessed: 'Yesterday' },
    { id: '3', title: 'TypeScript Mastery', progress: 20, lessons: '10/50', lastAccessed: '2 days ago' },
    { id: '4', title: 'Python for Data Science', progress: 10, lessons: '5/45', lastAccessed: '1 week ago' },
];

const achievements = [
    { id: '1', title: 'First Course', description: 'Complete your first course', earned: true, icon: '🎓' },
    { id: '2', title: 'Week Warrior', description: '7-day learning streak', earned: true, icon: '🔥' },
    { id: '3', title: 'Quiz Master', description: 'Score 100% on 5 quizzes', earned: true, icon: '🧠' },
    { id: '4', title: 'Dedicated Learner', description: 'Complete 100 lessons', earned: true, icon: '📚' },
    { id: '5', title: 'Month Master', description: '30-day learning streak', earned: false, icon: '🏆' },
    { id: '6', title: 'Course Champion', description: 'Complete 10 courses', earned: false, icon: '👑' },
];

export default function ProgressPage() {
    const stats = mockStats;
    const maxHours = Math.max(...weeklyProgress.map(d => d.hours));
    const totalWeeklyHours = weeklyProgress.reduce((acc, d) => acc + d.hours, 0);

    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'lesson': return <Play className="w-4 h-4" />;
            case 'quiz': return <Target className="w-4 h-4" />;
            case 'certificate': return <Award className="w-4 h-4" />;
            case 'course': return <BookOpen className="w-4 h-4" />;
        }
    };

    const getActivityColor = (type: RecentActivity['type']) => {
        switch (type) {
            case 'lesson': return 'bg-[var(--primary-500)]/20 text-[var(--primary-400)]';
            case 'quiz': return 'bg-[var(--accent-500)]/20 text-[var(--accent-400)]';
            case 'certificate': return 'bg-[var(--warning-500)]/20 text-[var(--warning-400)]';
            case 'course': return 'bg-[var(--success-500)]/20 text-[var(--success-400)]';
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Learning Progress</h1>
                <p className="text-[var(--text-secondary)]">
                    Track your learning journey and achievements
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.totalHours}h</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Learning</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.coursesCompleted}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Courses Completed</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.certificatesEarned}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Certificates</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Day Streak 🔥</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Weekly Progress Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
                            <p className="text-sm text-[var(--text-secondary)]">{totalWeeklyHours.toFixed(1)} hours this week</p>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--success-400)]">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">+23% vs last week</span>
                        </div>
                    </div>
                    <div className="h-48 flex items-end gap-4">
                        {weeklyProgress.map((data, index) => (
                            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-gradient-to-t from-[var(--primary-500)] to-[var(--accent-500)] rounded-t-lg transition-all hover:from-[var(--primary-400)] hover:to-[var(--accent-400)]"
                                    style={{ height: `${(data.hours / maxHours) * 100}%`, minHeight: '8px' }}
                                />
                                <span className="text-xs text-[var(--text-tertiary)]">{data.day}</span>
                                <span className="text-xs font-medium text-white">{data.hours}h</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Streak Card */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Learning Streak</h3>
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-500)] to-[var(--warning-500)] mb-3">
                            <span className="text-4xl">🔥</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.currentStreak} Days</p>
                        <p className="text-sm text-[var(--text-secondary)]">Current Streak</p>
                    </div>
                    <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-secondary)]">Longest Streak</span>
                            <span className="text-sm font-semibold text-white">{stats.longestStreak} days</span>
                        </div>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] text-center mt-4">
                        Keep learning daily to maintain your streak!
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Course Progress */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Course Progress</h3>
                        <Link href="/student/my-courses" className="text-sm text-[var(--primary-400)] hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {courseProgress.map((course) => (
                            <Link key={course.id} href={`/learn/${course.id}`} className="block p-4 bg-[var(--surface-glass)] rounded-xl hover:bg-[var(--surface-glass-hover)] transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-white truncate max-w-[200px]">{course.title}</h4>
                                    <span className="text-sm text-[var(--accent-400)] font-medium">{course.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] rounded-full transition-all"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                                    <span>{course.lessons} lessons</span>
                                    <span>Last: {course.lastAccessed}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-[var(--surface-glass)] rounded-xl">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                                    <p className="text-xs text-[var(--text-tertiary)] truncate">{activity.course}</p>
                                </div>
                                <div className="text-right">
                                    {activity.result && (
                                        <span className="text-sm font-semibold text-[var(--success-400)]">{activity.result}</span>
                                    )}
                                    <p className="text-xs text-[var(--text-tertiary)]">{activity.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[var(--warning-400)]" />
                        Achievements
                    </h3>
                    <span className="text-sm text-[var(--text-secondary)]">
                        {achievements.filter(a => a.earned).length}/{achievements.length} Earned
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`p-4 rounded-xl text-center transition-all ${achievement.earned
                                ? 'bg-gradient-to-br from-[var(--warning-500)]/20 to-[var(--accent-500)]/20 border border-[var(--warning-500)]/30'
                                : 'bg-[var(--surface-glass)] opacity-50'
                                }`}
                        >
                            <span className="text-3xl mb-2 block">{achievement.icon}</span>
                            <p className="text-sm font-medium text-white mb-1">{achievement.title}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{achievement.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
