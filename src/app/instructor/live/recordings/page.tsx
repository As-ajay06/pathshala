'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Video,
    Download,
    Trash2,
    Search,
    Filter,
    Play,
    Clock,
    Calendar,
    Users,
    Eye,
    Share2,
    MoreVertical,
    CheckCircle,
    Upload,
    HardDrive,
    Cloud
} from 'lucide-react';

interface Recording {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    size: string;
    date: string;
    views: number;
    course?: string;
    status: 'ready' | 'processing' | 'failed';
    isPublished: boolean;
}

const mockRecordings: Recording[] = [
    {
        id: '1',
        title: 'Advanced React Patterns & Best Practices',
        thumbnail: '/api/placeholder/320/180',
        duration: '1:28:45',
        size: '1.2 GB',
        date: 'Jan 25, 2026',
        views: 234,
        course: 'Complete React Masterclass',
        status: 'ready',
        isPublished: true,
    },
    {
        id: '2',
        title: 'Live Coding: Building a REST API',
        thumbnail: '/api/placeholder/320/180',
        duration: '2:05:12',
        size: '1.8 GB',
        date: 'Jan 24, 2026',
        views: 189,
        course: 'Node.js Backend Development',
        status: 'ready',
        isPublished: true,
    },
    {
        id: '3',
        title: 'Q&A Session: JavaScript Fundamentals',
        thumbnail: '/api/placeholder/320/180',
        duration: '58:30',
        size: '680 MB',
        date: 'Jan 23, 2026',
        views: 156,
        course: 'JavaScript Essentials',
        status: 'ready',
        isPublished: false,
    },
    {
        id: '4',
        title: 'TypeScript Deep Dive',
        thumbnail: '/api/placeholder/320/180',
        duration: '1:45:00',
        size: '1.5 GB',
        date: 'Jan 22, 2026',
        views: 0,
        course: 'TypeScript Mastery',
        status: 'processing',
        isPublished: false,
    },
];

export default function RecordingsPage() {
    const [recordings, setRecordings] = useState<Recording[]>(mockRecordings);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecordings, setSelectedRecordings] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const filteredRecordings = recordings.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedRecordings(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRecordings.length === filteredRecordings.length) {
            setSelectedRecordings([]);
        } else {
            setSelectedRecordings(filteredRecordings.map(r => r.id));
        }
    };

    const handleDelete = () => {
        setRecordings(prev => prev.filter(r => !selectedRecordings.includes(r.id)));
        setSelectedRecordings([]);
        setShowDeleteModal(false);
    };

    const togglePublish = (id: string) => {
        setRecordings(prev =>
            prev.map(r => r.id === id ? { ...r, isPublished: !r.isPublished } : r)
        );
    };

    const totalStorage = recordings.reduce((acc, r) => {
        const size = parseFloat(r.size);
        const unit = r.size.includes('GB') ? 1000 : 1;
        return acc + size * unit;
    }, 0);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link
                        href="/instructor/live"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Live Classes
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Recordings</h1>
                    <p className="text-[var(--text-secondary)]">
                        Manage your live class recordings
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{recordings.length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Recordings</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{recordings.filter(r => r.isPublished).length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Published</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{recordings.reduce((acc, r) => acc + r.views, 0)}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Views</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{(totalStorage / 1000).toFixed(1)} GB</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Storage Used</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            placeholder="Search recordings..."
                            className="input pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedRecordings.length > 0 && (
                            <>
                                <button className="btn btn-secondary btn-sm">
                                    <Download className="w-4 h-4" />
                                    Download ({selectedRecordings.length})
                                </button>
                                <button
                                    className="btn bg-[var(--error-500)]/20 text-[var(--error-400)] btn-sm"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Recordings List */}
            <div className="glass-card overflow-hidden">
                {/* Header Row */}
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-glass)]">
                    <input
                        type="checkbox"
                        checked={selectedRecordings.length === filteredRecordings.length && filteredRecordings.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-[var(--border-default)] bg-transparent"
                    />
                    <div className="flex-1 text-sm font-medium text-[var(--text-secondary)]">Recording</div>
                    <div className="hidden md:block w-24 text-sm font-medium text-[var(--text-secondary)] text-center">Duration</div>
                    <div className="hidden md:block w-20 text-sm font-medium text-[var(--text-secondary)] text-center">Views</div>
                    <div className="hidden md:block w-24 text-sm font-medium text-[var(--text-secondary)] text-center">Status</div>
                    <div className="w-24 text-sm font-medium text-[var(--text-secondary)] text-center">Actions</div>
                </div>

                {/* Recording Rows */}
                {filteredRecordings.length === 0 ? (
                    <div className="p-12 text-center">
                        <Video className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No recordings found</h3>
                        <p className="text-[var(--text-secondary)]">
                            {searchQuery ? 'Try a different search term' : 'Your live class recordings will appear here'}
                        </p>
                    </div>
                ) : (
                    filteredRecordings.map((recording) => (
                        <div
                            key={recording.id}
                            className={`flex items-center gap-4 p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--surface-glass)] transition-colors ${selectedRecordings.includes(recording.id) ? 'bg-[var(--primary-500)]/10' : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedRecordings.includes(recording.id)}
                                onChange={() => toggleSelect(recording.id)}
                                className="w-4 h-4 rounded border-[var(--border-default)] bg-transparent"
                            />

                            {/* Recording Info */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="relative w-24 h-14 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden flex-shrink-0">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Video className="w-6 h-6 text-[var(--text-tertiary)]" />
                                    </div>
                                    {recording.status === 'processing' && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-medium truncate">{recording.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                                        <span>{recording.date}</span>
                                        {recording.course && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate">{recording.course}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="hidden md:flex w-24 justify-center">
                                <span className="text-sm text-[var(--text-secondary)]">{recording.duration}</span>
                            </div>

                            {/* Views */}
                            <div className="hidden md:flex w-20 justify-center">
                                <span className="text-sm text-[var(--text-secondary)]">{recording.views}</span>
                            </div>

                            {/* Status */}
                            <div className="hidden md:flex w-24 justify-center">
                                {recording.status === 'processing' ? (
                                    <span className="px-2 py-1 text-xs bg-[var(--warning-500)]/20 text-[var(--warning-400)] rounded">
                                        Processing
                                    </span>
                                ) : recording.isPublished ? (
                                    <span className="px-2 py-1 text-xs bg-[var(--success-500)]/20 text-[var(--success-400)] rounded">
                                        Published
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 text-xs bg-[var(--surface-glass)] text-[var(--text-tertiary)] rounded">
                                        Draft
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="w-24 flex items-center justify-center gap-1">
                                <button className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                    <Play className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                    <Download className="w-4 h-4" />
                                </button>
                                <div className="relative group">
                                    <button className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    <div className="absolute right-0 top-full mt-1 w-40 glass-card p-2 hidden group-hover:block z-10">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                        <button
                                            onClick={() => togglePublish(recording.id)}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]"
                                        >
                                            {recording.isPublished ? (
                                                <>
                                                    <Cloud className="w-4 h-4" />
                                                    Unpublish
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4" />
                                                    Publish
                                                </>
                                            )}
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--error-400)] rounded-lg hover:bg-[var(--error-500)]/10">
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="glass-card p-6 max-w-md mx-4 animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-[var(--error-500)]/20 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-[var(--error-400)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center mb-2">Delete Recordings?</h3>
                        <p className="text-[var(--text-secondary)] text-center mb-6">
                            Are you sure you want to delete {selectedRecordings.length} recording{selectedRecordings.length > 1 ? 's' : ''}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 btn bg-[var(--error-500)] hover:bg-[var(--error-600)] text-white"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
