'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    Video,
    BookOpen,
    Globe,
    Lock,
    Save,
    Trash2,
    AlertCircle,
    ChevronDown,
    Bell
} from 'lucide-react';

const courses = [
    { id: '1', title: 'Complete React Masterclass' },
    { id: '2', title: 'Node.js Backend Development' },
    { id: '3', title: 'JavaScript Essentials' },
    { id: '4', title: 'TypeScript Mastery' },
];

const durations = [30, 45, 60, 90, 120, 180];

export default function EditLiveClassPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form State - Pre-filled with mock data
    const [title, setTitle] = useState('Advanced React Patterns & Best Practices');
    const [description, setDescription] = useState('Deep dive into React patterns including compound components, render props, and hooks. This session covers advanced concepts that will help you write cleaner, more maintainable React code.');
    const [selectedCourse, setSelectedCourse] = useState('1');
    const [date, setDate] = useState('2026-01-27');
    const [time, setTime] = useState('19:00');
    const [duration, setDuration] = useState(90);
    const [maxAttendees, setMaxAttendees] = useState(100);
    const [isPublic, setIsPublic] = useState(true);
    const [enableRecording, setEnableRecording] = useState(true);
    const [enableChat, setEnableChat] = useState(true);
    const [enableQA, setEnableQA] = useState(true);
    const [sendReminders, setSendReminders] = useState(true);
    const [tags, setTags] = useState<string[]>(['React', 'Advanced', 'Patterns']);
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Update in database
        await new Promise(resolve => setTimeout(resolve, 1500));

        router.push(`/instructor/live/${params.id}`);
    };

    const handleDelete = async () => {
        // TODO: Delete from database
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/instructor/live');
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href={`/instructor/live/${params.id}`}
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Class Details
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Edit Live Class</h1>
                </div>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn bg-[var(--error-500)]/20 text-[var(--error-400)] hover:bg-[var(--error-500)]/30"
                >
                    <Trash2 className="w-4 h-4" />
                    Cancel Class
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Info */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-[var(--accent-400)]" />
                        Class Details
                    </h2>

                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="input-label">Class Title *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., Advanced React Patterns Workshop"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Description</label>
                            <textarea
                                className="input min-h-[100px]"
                                placeholder="What will students learn in this session?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Related Course (Optional)</label>
                            <div className="relative">
                                <select
                                    className="input appearance-none cursor-pointer"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">Standalone Session</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="form-group">
                            <label className="input-label">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--primary-500)]/20 text-[var(--primary-400)] rounded-lg text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-[var(--error-400)]"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                className="input"
                                placeholder="Add tags (press Enter)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                            />
                        </div>
                    </div>
                </div>

                {/* Scheduling */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--accent-400)]" />
                        Schedule
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="form-group">
                            <label className="input-label">Date *</label>
                            <input
                                type="date"
                                className="input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Time *</label>
                            <input
                                type="time"
                                className="input"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Duration</label>
                            <div className="relative">
                                <select
                                    className="input appearance-none cursor-pointer"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                >
                                    {durations.map((d) => (
                                        <option key={d} value={d}>{d} minutes</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="input-label">Max Attendees</label>
                        <input
                            type="number"
                            className="input"
                            value={maxAttendees}
                            onChange={(e) => setMaxAttendees(Number(e.target.value))}
                            min={1}
                            max={1000}
                        />
                    </div>
                </div>

                {/* Settings */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[var(--accent-400)]" />
                        Settings
                    </h2>

                    <div className="space-y-4">
                        {/* Visibility */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setIsPublic(true)}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all ${isPublic
                                    ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10'
                                    : 'border-[var(--border-subtle)]'
                                    }`}
                            >
                                <Globe className={`w-6 h-6 mx-auto mb-2 ${isPublic ? 'text-[var(--primary-400)]' : 'text-[var(--text-tertiary)]'}`} />
                                <p className={`text-sm font-medium ${isPublic ? 'text-white' : 'text-[var(--text-secondary)]'}`}>Public</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsPublic(false)}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all ${!isPublic
                                    ? 'border-[var(--accent-500)] bg-[var(--accent-500)]/10'
                                    : 'border-[var(--border-subtle)]'
                                    }`}
                            >
                                <Lock className={`w-6 h-6 mx-auto mb-2 ${!isPublic ? 'text-[var(--accent-400)]' : 'text-[var(--text-tertiary)]'}`} />
                                <p className={`text-sm font-medium ${!isPublic ? 'text-white' : 'text-[var(--text-secondary)]'}`}>Private</p>
                            </button>
                        </div>

                        {/* Toggles */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <label className="flex items-center justify-between p-4 bg-[var(--surface-glass)] rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Video className="w-5 h-5 text-[var(--text-secondary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Enable Recording</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={enableRecording}
                                    onChange={(e) => setEnableRecording(e.target.checked)}
                                    className="w-5 h-5 rounded border-[var(--border-default)] bg-transparent text-[var(--primary-500)]"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-[var(--surface-glass)] rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Send Reminders</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={sendReminders}
                                    onChange={(e) => setSendReminders(e.target.checked)}
                                    className="w-5 h-5 rounded border-[var(--border-default)] bg-transparent text-[var(--primary-500)]"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-[var(--surface-glass)] rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-[var(--text-secondary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Enable Chat</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={enableChat}
                                    onChange={(e) => setEnableChat(e.target.checked)}
                                    className="w-5 h-5 rounded border-[var(--border-default)] bg-transparent text-[var(--primary-500)]"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-[var(--surface-glass)] rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-[var(--text-secondary)]" />
                                    <span className="text-sm text-[var(--text-secondary)]">Enable Q&A</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={enableQA}
                                    onChange={(e) => setEnableQA(e.target.checked)}
                                    className="w-5 h-5 rounded border-[var(--border-default)] bg-transparent text-[var(--primary-500)]"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between">
                    <Link href={`/instructor/live/${params.id}`} className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-accent" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                        <Save className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="glass-card p-6 max-w-md mx-4 animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-[var(--error-500)]/20 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-[var(--error-400)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center mb-2">Cancel This Class?</h3>
                        <p className="text-[var(--text-secondary)] text-center mb-6">
                            This will notify all registered students and cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Keep Class
                            </button>
                            <button
                                className="flex-1 btn bg-[var(--error-500)] hover:bg-[var(--error-600)] text-white"
                                onClick={handleDelete}
                            >
                                Cancel Class
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
