'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Video,
    Plus,
    Calendar,
    Clock,
    Users,
    Play,
    Pause,
    Settings,
    MoreVertical,
    Search,
    Filter,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Copy,
    ExternalLink,
    CheckCircle,
    XCircle,
    AlertCircle,
    Zap,
    Star,
    BookOpen,
    MessageSquare,
    BarChart3
} from 'lucide-react';

interface LiveClass {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    attendees: number;
    maxAttendees: number;
    thumbnail: string;
    course?: string;
    tags: string[];
    meetingLink?: string;
}

interface AIRecommendation {
    id: string;
    type: 'time' | 'topic' | 'engagement' | 'improvement';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionLabel: string;
}

// Mock data for live classes
const mockClasses: LiveClass[] = [
    {
        id: '1',
        title: 'Advanced React Patterns & Best Practices',
        description: 'Deep dive into React patterns including compound components, render props, and hooks.',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        status: 'scheduled',
        attendees: 45,
        maxAttendees: 100,
        thumbnail: '/api/placeholder/400/225',
        course: 'Complete React Masterclass',
        tags: ['React', 'Advanced', 'Patterns'],
    },
    {
        id: '2',
        title: 'Live Coding: Building a REST API',
        description: 'Watch me build a complete REST API from scratch using Node.js and Express.',
        scheduledAt: new Date().toISOString(),
        duration: 120,
        status: 'live',
        attendees: 78,
        maxAttendees: 150,
        thumbnail: '/api/placeholder/400/225',
        course: 'Node.js Backend Development',
        tags: ['Node.js', 'API', 'Backend'],
        meetingLink: 'https://meet.example.com/abc123',
    },
    {
        id: '3',
        title: 'Q&A Session: JavaScript Fundamentals',
        description: 'Interactive Q&A session to clarify JavaScript concepts and answer student questions.',
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        status: 'completed',
        attendees: 92,
        maxAttendees: 100,
        thumbnail: '/api/placeholder/400/225',
        course: 'JavaScript Essentials',
        tags: ['JavaScript', 'Q&A', 'Beginner'],
    },
    {
        id: '4',
        title: 'TypeScript Deep Dive',
        description: 'Comprehensive session on TypeScript advanced types and generics.',
        scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        status: 'scheduled',
        attendees: 32,
        maxAttendees: 80,
        thumbnail: '/api/placeholder/400/225',
        course: 'TypeScript Mastery',
        tags: ['TypeScript', 'Advanced'],
    },
];

// AI Recommendations
const mockRecommendations: AIRecommendation[] = [
    {
        id: '1',
        type: 'time',
        title: 'Optimal Scheduling Time',
        description: 'Your students are most active between 7-9 PM IST. Schedule your next class during this window for 40% higher attendance.',
        impact: 'high',
        actionLabel: 'Schedule Now',
    },
    {
        id: '2',
        type: 'topic',
        title: 'Trending Topic Suggestion',
        description: 'Based on student queries, "State Management with Redux Toolkit" is highly requested. Consider a live session on this topic.',
        impact: 'high',
        actionLabel: 'Create Session',
    },
    {
        id: '3',
        type: 'engagement',
        title: 'Boost Engagement',
        description: 'Your last 3 sessions had 25% drop-off after 45 mins. Try adding interactive polls or Q&A breaks every 30 minutes.',
        impact: 'medium',
        actionLabel: 'Learn More',
    },
    {
        id: '4',
        type: 'improvement',
        title: 'Recording Quality',
        description: 'Students rated audio quality 3.5/5 in recent sessions. Consider upgrading your microphone for better clarity.',
        impact: 'low',
        actionLabel: 'View Tips',
    },
];

export default function LiveClassesPage() {
    const [classes, setClasses] = useState<LiveClass[]>(mockClasses);
    const [recommendations] = useState<AIRecommendation[]>(mockRecommendations);
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAIPanel, setShowAIPanel] = useState(true);

    const filteredClasses = classes.filter((cls) => {
        const matchesFilter = filter === 'all' || cls.status === filter;
        const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: classes.length,
        live: classes.filter(c => c.status === 'live').length,
        scheduled: classes.filter(c => c.status === 'scheduled').length,
        completed: classes.filter(c => c.status === 'completed').length,
        totalAttendees: classes.reduce((acc, c) => acc + c.attendees, 0),
    };

    const getStatusColor = (status: LiveClass['status']) => {
        switch (status) {
            case 'live': return 'bg-[var(--error-500)] animate-pulse';
            case 'scheduled': return 'bg-[var(--primary-500)]';
            case 'completed': return 'bg-[var(--success-500)]';
            case 'cancelled': return 'bg-[var(--text-tertiary)]';
        }
    };

    const getStatusLabel = (status: LiveClass['status']) => {
        switch (status) {
            case 'live': return 'LIVE NOW';
            case 'scheduled': return 'Scheduled';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
        }
    };

    const getImpactColor = (impact: AIRecommendation['impact']) => {
        switch (impact) {
            case 'high': return 'text-[var(--error-400)] bg-[var(--error-500)]/10';
            case 'medium': return 'text-[var(--warning-400)] bg-[var(--warning-500)]/10';
            case 'low': return 'text-[var(--primary-400)] bg-[var(--primary-500)]/10';
        }
    };

    const getRecommendationIcon = (type: AIRecommendation['type']) => {
        switch (type) {
            case 'time': return <Clock className="w-5 h-5" />;
            case 'topic': return <TrendingUp className="w-5 h-5" />;
            case 'engagement': return <MessageSquare className="w-5 h-5" />;
            case 'improvement': return <BarChart3 className="w-5 h-5" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Live Classes</h1>
                    <p className="text-[var(--text-secondary)]">
                        Manage your live sessions and interact with students in real-time
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAIPanel(!showAIPanel)}
                        className={`btn ${showAIPanel ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Insights
                    </button>
                    <Link href="/instructor/live/schedule" className="btn btn-accent">
                        <Plus className="w-4 h-4" />
                        Schedule Class
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Classes</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--error-500)]/20 flex items-center justify-center">
                            <Play className="w-5 h-5 text-[var(--error-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.live}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Live Now</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.totalAttendees}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Attendees</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Search and Filters */}
                    <div className="glass-card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                <input
                                    type="text"
                                    placeholder="Search live classes..."
                                    className="input pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                {(['all', 'live', 'scheduled', 'completed'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                            ? 'bg-[var(--accent-500)] text-white'
                                            : 'bg-[var(--surface-glass)] text-[var(--text-secondary)] hover:text-white'
                                            }`}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Classes List */}
                    <div className="space-y-4">
                        {filteredClasses.length === 0 ? (
                            <div className="glass-card p-12 text-center">
                                <Video className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No classes found</h3>
                                <p className="text-[var(--text-secondary)] mb-4">
                                    {filter === 'all' ? "You haven't scheduled any live classes yet." : `No ${filter} classes found.`}
                                </p>
                                <Link href="/instructor/live/schedule" className="btn btn-primary">
                                    <Plus className="w-4 h-4" />
                                    Schedule Your First Class
                                </Link>
                            </div>
                        ) : (
                            filteredClasses.map((cls) => (
                                <div key={cls.id} className="glass-card overflow-hidden hover:border-[var(--border-strong)] transition-all">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Thumbnail */}
                                        <div className="relative md:w-64 h-40 md:h-auto bg-[var(--bg-tertiary)] flex-shrink-0">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Video className="w-12 h-12 text-[var(--text-tertiary)]" />
                                            </div>
                                            {/* Status Badge */}
                                            <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold text-white ${getStatusColor(cls.status)}`}>
                                                {getStatusLabel(cls.status)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <Link href={`/instructor/live/${cls.id}`} className="text-lg font-semibold text-white hover:text-[var(--primary-400)] transition-colors">
                                                        {cls.title}
                                                    </Link>
                                                    {cls.course && (
                                                        <p className="text-sm text-[var(--accent-400)]">
                                                            <BookOpen className="w-3 h-3 inline mr-1" />
                                                            {cls.course}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="relative group">
                                                    <button className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-1 w-48 glass-card p-2 hidden group-hover:block z-10">
                                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </button>
                                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                                            <Copy className="w-4 h-4" />
                                                            Duplicate
                                                        </button>
                                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--error-400)] rounded-lg hover:bg-[var(--error-500)]/10">
                                                            <Trash2 className="w-4 h-4" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                                {cls.description}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {cls.tags.map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 text-xs bg-[var(--surface-glass)] text-[var(--text-secondary)] rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Meta Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(cls.scheduledAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {cls.duration} mins
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {cls.attendees}/{cls.maxAttendees}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 mt-4">
                                                {cls.status === 'live' ? (
                                                    <>
                                                        <Link href={`/instructor/live/${cls.id}/studio`} className="btn btn-primary btn-sm">
                                                            <ExternalLink className="w-4 h-4" />
                                                            Enter Studio
                                                        </Link>
                                                        <button className="btn btn-secondary btn-sm">
                                                            <Pause className="w-4 h-4" />
                                                            End Class
                                                        </button>
                                                    </>
                                                ) : cls.status === 'scheduled' ? (
                                                    <>
                                                        <Link href={`/instructor/live/${cls.id}/studio`} className="btn btn-accent btn-sm">
                                                            <Play className="w-4 h-4" />
                                                            Start Class
                                                        </Link>
                                                        <Link href={`/instructor/live/${cls.id}/edit`} className="btn btn-secondary btn-sm">
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={`/instructor/live/${cls.id}/analytics`} className="btn btn-secondary btn-sm">
                                                            <BarChart3 className="w-4 h-4" />
                                                            View Analytics
                                                        </Link>
                                                        <button className="btn btn-ghost btn-sm">
                                                            <Eye className="w-4 h-4" />
                                                            Watch Recording
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* AI Recommendations Panel */}
                {showAIPanel && (
                    <div className="lg:w-80 space-y-4">
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">AI Recommendations</h3>
                                    <p className="text-xs text-[var(--text-tertiary)]">Personalized insights</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {recommendations.map((rec) => (
                                    <div key={rec.id} className="p-3 bg-[var(--surface-glass)] rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getImpactColor(rec.impact)}`}>
                                                {getRecommendationIcon(rec.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${getImpactColor(rec.impact)}`}>
                                                        {rec.impact}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] mb-2">
                                                    {rec.description}
                                                </p>
                                                <button className="text-xs text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium flex items-center gap-1">
                                                    {rec.actionLabel}
                                                    <ChevronRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card p-4">
                            <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link href="/instructor/live/schedule" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-glass)] transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-[var(--accent-400)]" />
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)]">Schedule New Class</span>
                                </Link>
                                <Link href="/instructor/live/calendar" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-glass)] transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-[var(--primary-400)]" />
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)]">View Calendar</span>
                                </Link>
                                <Link href="/instructor/live/recordings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-glass)] transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                                        <Video className="w-4 h-4 text-[var(--success-400)]" />
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)]">Manage Recordings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
