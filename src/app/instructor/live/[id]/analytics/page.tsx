'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    BarChart3,
    Users,
    Clock,
    MessageSquare,
    ThumbsUp,
    TrendingUp,
    TrendingDown,
    Eye,
    Play,
    Pause,
    Download,
    Calendar,
    Target,
    Zap,
    Award,
    Star,
    ChevronDown
} from 'lucide-react';

// Mock analytics data
const analyticsData = {
    overview: {
        totalAttendees: 78,
        peakViewers: 92,
        avgWatchTime: '52 mins',
        totalDuration: '90 mins',
        engagementRate: 85,
        chatMessages: 234,
        questionsAsked: 18,
        questionsAnswered: 15,
    },
    viewerTimeline: [
        { time: '0', viewers: 45 },
        { time: '5', viewers: 62 },
        { time: '10', viewers: 78 },
        { time: '15', viewers: 85 },
        { time: '20', viewers: 88 },
        { time: '25', viewers: 92 },
        { time: '30', viewers: 90 },
        { time: '35', viewers: 85 },
        { time: '40', viewers: 82 },
        { time: '45', viewers: 78 },
        { time: '50', viewers: 75 },
        { time: '55', viewers: 72 },
        { time: '60', viewers: 70 },
        { time: '65', viewers: 68 },
        { time: '70', viewers: 65 },
        { time: '75', viewers: 60 },
        { time: '80', viewers: 55 },
        { time: '85', viewers: 52 },
        { time: '90', viewers: 50 },
    ],
    engagementBreakdown: [
        { label: 'Active Participants', value: 65, color: 'var(--primary-500)' },
        { label: 'Passive Viewers', value: 25, color: 'var(--accent-500)' },
        { label: 'Dropoffs', value: 10, color: 'var(--text-tertiary)' },
    ],
    topQuestions: [
        { question: 'How do compound components differ from render props?', votes: 12, answered: true },
        { question: 'Can you show a real-world example?', votes: 8, answered: true },
        { question: 'Is this compatible with TypeScript?', votes: 5, answered: true },
        { question: 'What about performance implications?', votes: 4, answered: false },
    ],
    feedback: {
        avgRating: 4.7,
        totalRatings: 45,
        breakdown: [
            { stars: 5, count: 32 },
            { stars: 4, count: 10 },
            { stars: 3, count: 2 },
            { stars: 2, count: 1 },
            { stars: 1, count: 0 },
        ],
    },
    aiInsights: [
        {
            type: 'positive',
            title: 'Strong Engagement',
            description: 'Your engagement rate of 85% is 20% higher than your average. The interactive coding demo at 25:00 had peak engagement.',
        },
        {
            type: 'improvement',
            title: 'Viewer Dropoff',
            description: 'Noticed 15% dropoff after the 45-minute mark. Consider adding a break or interactive element around this time.',
        },
        {
            type: 'positive',
            title: 'Q&A Performance',
            description: 'You answered 83% of questions during the session. Students particularly appreciated the compound components explanation.',
        },
    ],
};

export default function LiveClassAnalyticsPage() {
    const params = useParams();
    const [dateRange, setDateRange] = useState('session');

    const maxViewers = Math.max(...analyticsData.viewerTimeline.map(d => d.viewers));

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={`/instructor/live/${params.id}`}
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Class Details
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Session Analytics</h1>
                        <p className="text-[var(--text-secondary)]">
                            Advanced React Patterns & Best Practices • Jan 25, 2026
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn btn-secondary">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{analyticsData.overview.totalAttendees}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Attendees</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{analyticsData.overview.peakViewers}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Peak Viewers</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{analyticsData.overview.avgWatchTime}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Avg Watch Time</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{analyticsData.overview.engagementRate}%</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Engagement Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Charts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Viewer Timeline Chart */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Viewer Timeline</h3>
                        <div className="h-64 flex items-end gap-1">
                            {analyticsData.viewerTimeline.map((point, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-gradient-to-t from-[var(--primary-500)] to-[var(--primary-400)] rounded-t transition-all hover:from-[var(--primary-400)] hover:to-[var(--primary-300)]"
                                        style={{ height: `${(point.viewers / maxViewers) * 100}%` }}
                                        title={`${point.viewers} viewers at ${point.time} min`}
                                    />
                                    {index % 3 === 0 && (
                                        <span className="text-[10px] text-[var(--text-tertiary)]">{point.time}m</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Engagement Breakdown */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Engagement Breakdown</h3>
                        <div className="flex items-center gap-8">
                            {/* Donut Chart Placeholder */}
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="60" fill="none" stroke="var(--surface-glass)" strokeWidth="20" />
                                    <circle
                                        cx="80" cy="80" r="60" fill="none"
                                        stroke="var(--primary-500)"
                                        strokeWidth="20"
                                        strokeDasharray={`${65 * 3.77} ${100 * 3.77}`}
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="80" cy="80" r="60" fill="none"
                                        stroke="var(--accent-500)"
                                        strokeWidth="20"
                                        strokeDasharray={`${25 * 3.77} ${100 * 3.77}`}
                                        strokeDashoffset={`${-65 * 3.77}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">85%</p>
                                        <p className="text-xs text-[var(--text-tertiary)]">Engaged</p>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-3">
                                {analyticsData.engagementBreakdown.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                                        <span className="text-sm font-semibold text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Questions */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Questions</h3>
                        <div className="space-y-3">
                            {analyticsData.topQuestions.map((q, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-[var(--surface-glass)] rounded-lg">
                                    <div className="flex items-center gap-1 text-[var(--primary-400)]">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="text-sm font-semibold">{q.votes}</span>
                                    </div>
                                    <p className="flex-1 text-sm text-[var(--text-secondary)]">{q.question}</p>
                                    {q.answered ? (
                                        <span className="px-2 py-0.5 text-xs bg-[var(--success-500)]/20 text-[var(--success-400)] rounded">Answered</span>
                                    ) : (
                                        <span className="px-2 py-0.5 text-xs bg-[var(--warning-500)]/20 text-[var(--warning-400)] rounded">Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Additional Stats */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">Session Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Chat Messages</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{analyticsData.overview.chatMessages}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Questions Asked</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{analyticsData.overview.questionsAsked}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Questions Answered</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{analyticsData.overview.questionsAnswered}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Duration</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{analyticsData.overview.totalDuration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">Session Rating</h3>
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-6 h-6 ${star <= Math.round(analyticsData.feedback.avgRating)
                                            ? 'text-[var(--warning-400)] fill-current'
                                            : 'text-[var(--text-tertiary)]'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-2xl font-bold text-white">{analyticsData.feedback.avgRating}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">from {analyticsData.feedback.totalRatings} ratings</p>
                        </div>

                        <div className="space-y-2">
                            {analyticsData.feedback.breakdown.map((item) => (
                                <div key={item.stars} className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--text-tertiary)] w-4">{item.stars}</span>
                                    <Star className="w-3 h-3 text-[var(--warning-400)]" />
                                    <div className="flex-1 h-2 bg-[var(--surface-glass)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--warning-400)] rounded-full"
                                            style={{ width: `${(item.count / analyticsData.feedback.totalRatings) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-[var(--text-tertiary)] w-6">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[var(--accent-400)]" />
                            AI Insights
                        </h3>
                        <div className="space-y-3">
                            {analyticsData.aiInsights.map((insight, index) => (
                                <div key={index} className={`p-3 rounded-lg border ${insight.type === 'positive'
                                    ? 'bg-[var(--success-500)]/10 border-[var(--success-500)]/30'
                                    : 'bg-[var(--warning-500)]/10 border-[var(--warning-500)]/30'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        {insight.type === 'positive' ? (
                                            <TrendingUp className="w-4 h-4 text-[var(--success-400)]" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-[var(--warning-400)]" />
                                        )}
                                        <span className={`text-sm font-medium ${insight.type === 'positive'
                                            ? 'text-[var(--success-400)]'
                                            : 'text-[var(--warning-400)]'
                                            }`}>
                                            {insight.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)]">{insight.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
