'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Loader2,
    ArrowUpDown,
    CheckCircle,
    Clock,
    IndianRupee,
    BookOpen,
    BarChart3
} from 'lucide-react';

export default function EarningsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEarnings() {
            try {
                const res = await fetch('/api/instructor/dashboard');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error('Failed to fetch earnings:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--accent-400)] animate-spin" />
            </div>
        );
    }

    const totalEarnings = data?.stats?.totalEarnings || 0;
    const totalStudents = data?.stats?.totalStudents || 0;
    const totalCourses = data?.stats?.totalCourses || 0;

    const stats = [
        { icon: IndianRupee, label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, color: 'from-[var(--success-400)] to-green-600' },
        { icon: TrendingUp, label: 'Total Students', value: totalStudents, color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
        { icon: BookOpen, label: 'Total Courses', value: totalCourses, color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
    ];

    // Sorted courses by revenue
    const coursesByRevenue = [...(data?.courses || [])].sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Earnings</h1>
                <p className="text-[var(--text-secondary)]">Track your revenue and performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Revenue by Course */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Revenue by Course</h2>
                {coursesByRevenue.length > 0 ? (
                    <div className="space-y-3">
                        {coursesByRevenue.map((course: any) => (
                            <div key={course._id} className="glass-card p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-800)] flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-6 h-6 text-white/40" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">{course.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                                        <span>{course.studentsCount} students</span>
                                        <span>•</span>
                                        <span>{course.lessonsCount} lessons</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-[var(--success-400)]">₹{(course.revenue || 0).toLocaleString()}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">
                                        {totalEarnings > 0
                                            ? `${Math.round((course.revenue / totalEarnings) * 100)}% of total`
                                            : '0%'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-8 text-center">
                        <BarChart3 className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">No earnings yet</h3>
                        <p className="text-[var(--text-secondary)]">Start selling courses to see your revenue here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
