'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    Video,
    Play,
    Edit,
    Trash2,
    Share2,
    Copy,
    ExternalLink,
    MessageSquare,
    BarChart3,
    BookOpen,
    CheckCircle,
    AlertCircle,
    Globe,
    Lock,
    Bell,
    Settings,
    Eye,
    Download,
    Mail
} from 'lucide-react';

// Mock class data
const mockClass = {
    id: '1',
    title: 'Advanced React Patterns & Best Practices',
    description: 'Deep dive into React patterns including compound components, render props, and hooks. This session covers advanced concepts that will help you write cleaner, more maintainable React code. We will explore real-world examples and best practices used in production applications.',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    status: 'scheduled' as const,
    attendees: 45,
    maxAttendees: 100,
    course: {
        id: '1',
        title: 'Complete React Masterclass',
    },
    tags: ['React', 'Advanced', 'Patterns', 'Hooks'],
    isPublic: true,
    enableRecording: true,
    enableChat: true,
    enableQA: true,
    meetingLink: 'https://meet.learnflow.com/abc123xyz',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    registeredStudents: [
        { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD', joinedAt: '2 days ago' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', joinedAt: '1 day ago' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', joinedAt: '5 hours ago' },
        { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'SW', joinedAt: '3 hours ago' },
        { id: '5', name: 'Alex Brown', email: 'alex@example.com', avatar: 'AB', joinedAt: '1 hour ago' },
    ],
};

export default function LiveClassDetailPage() {
    const params = useParams();
    const [copied, setCopied] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const classData = mockClass;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTimeUntil = (dateString: string) => {
        const now = new Date();
        const target = new Date(dateString);
        const diff = target.getTime() - now.getTime();

        if (diff < 0) return 'Started';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} day${days > 1 ? 's' : ''} away`;
        }
        return `${hours}h ${minutes}m away`;
    };

    const copyLink = () => {
        navigator.clipboard.writeText(classData.meetingLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live': return 'bg-[var(--error-500)] text-white';
            case 'scheduled': return 'bg-[var(--primary-500)] text-white';
            case 'completed': return 'bg-[var(--success-500)] text-white';
            default: return 'bg-[var(--text-tertiary)] text-white';
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/instructor/live"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Live Classes
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(classData.status)}`}>
                                {classData.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-[var(--accent-400)]">
                                {getTimeUntil(classData.scheduledAt)}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{classData.title}</h1>
                        <Link href={`/instructor/courses/${classData.course.id}`} className="text-[var(--primary-400)] hover:underline flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {classData.course.title}
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/instructor/live/${params.id}/edit`} className="btn btn-secondary">
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                        <Link href={`/instructor/live/${params.id}/studio`} className="btn btn-accent">
                            <Play className="w-4 h-4" />
                            Start Class
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">About This Class</h2>
                        <p className="text-[var(--text-secondary)] whitespace-pre-line">
                            {classData.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {classData.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-[var(--surface-glass)] text-[var(--text-secondary)] rounded-full text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Meeting Link */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Meeting Link</h2>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 p-3 bg-[var(--surface-glass)] rounded-lg text-[var(--text-secondary)] font-mono text-sm truncate">
                                {classData.meetingLink}
                            </div>
                            <button onClick={copyLink} className="btn btn-secondary">
                                {copied ? <CheckCircle className="w-4 h-4 text-[var(--success-400)]" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <button className="btn btn-ghost btn-sm">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button className="btn btn-ghost btn-sm">
                                <Mail className="w-4 h-4" />
                                Email Students
                            </button>
                        </div>
                    </div>

                    {/* Registered Students */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">
                                Registered Students ({classData.registeredStudents.length})
                            </h2>
                            <button className="btn btn-ghost btn-sm">
                                <Download className="w-4 h-4" />
                                Export List
                            </button>
                        </div>

                        <div className="space-y-3">
                            {classData.registeredStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white font-semibold text-sm">
                                            {student.avatar}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{student.name}</p>
                                            <p className="text-xs text-[var(--text-tertiary)]">{student.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-[var(--text-tertiary)]">Joined {student.joinedAt}</span>
                                </div>
                            ))}
                        </div>

                        {classData.registeredStudents.length > 5 && (
                            <button className="w-full mt-4 text-center text-sm text-[var(--primary-400)] hover:underline">
                                View all {classData.attendees} registered students
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">Class Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[var(--primary-400)]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)]">Date</p>
                                    <p className="text-white">{formatDate(classData.scheduledAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-[var(--accent-400)]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)]">Time & Duration</p>
                                    <p className="text-white">{formatTime(classData.scheduledAt)} • {classData.duration} mins</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[var(--success-400)]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)]">Attendance</p>
                                    <p className="text-white">{classData.attendees} / {classData.maxAttendees} registered</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                                    {classData.isPublic ? <Globe className="w-5 h-5 text-[var(--warning-400)]" /> : <Lock className="w-5 h-5 text-[var(--warning-400)]" />}
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-tertiary)]">Visibility</p>
                                    <p className="text-white">{classData.isPublic ? 'Public' : 'Private'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Overview */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">Settings</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-secondary)]">Recording</span>
                                <span className={`text-sm ${classData.enableRecording ? 'text-[var(--success-400)]' : 'text-[var(--text-tertiary)]'}`}>
                                    {classData.enableRecording ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-secondary)]">Live Chat</span>
                                <span className={`text-sm ${classData.enableChat ? 'text-[var(--success-400)]' : 'text-[var(--text-tertiary)]'}`}>
                                    {classData.enableChat ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-secondary)]">Q&A</span>
                                <span className={`text-sm ${classData.enableQA ? 'text-[var(--success-400)]' : 'text-[var(--text-tertiary)]'}`}>
                                    {classData.enableQA ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href={`/instructor/live/${params.id}/analytics`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-glass)] transition-colors">
                                <BarChart3 className="w-5 h-5 text-[var(--primary-400)]" />
                                <span className="text-sm text-[var(--text-secondary)]">View Analytics</span>
                            </Link>
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-glass)] transition-colors">
                                <Bell className="w-5 h-5 text-[var(--accent-400)]" />
                                <span className="text-sm text-[var(--text-secondary)]">Send Reminder</span>
                            </button>
                            <button
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--error-500)]/10 transition-colors text-[var(--error-400)]"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <Trash2 className="w-5 h-5" />
                                <span className="text-sm">Cancel Class</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="glass-card p-6 max-w-md mx-4 animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-[var(--error-500)]/20 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-[var(--error-400)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center mb-2">Cancel This Class?</h3>
                        <p className="text-[var(--text-secondary)] text-center mb-6">
                            This will notify all {classData.attendees} registered students. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Keep Class
                            </button>
                            <button className="flex-1 btn bg-[var(--error-500)] hover:bg-[var(--error-600)] text-white">
                                Cancel Class
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
