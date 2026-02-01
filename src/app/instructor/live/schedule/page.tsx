'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Sparkles,
    RefreshCw,
    Check,
    ChevronDown,
    Zap,
    AlertCircle,
    Info,
    Image as ImageIcon,
    Copy,
    Link as LinkIcon,
    Bell
} from 'lucide-react';

interface TimeSlot {
    time: string;
    score: number;
    label: string;
}

interface TopicSuggestion {
    topic: string;
    demand: 'high' | 'medium' | 'low';
    reason: string;
}

// AI-generated optimal time slots
const aiTimeSlots: TimeSlot[] = [
    { time: '19:00', score: 95, label: 'Best' },
    { time: '20:00', score: 88, label: 'Great' },
    { time: '18:00', score: 75, label: 'Good' },
    { time: '21:00', score: 70, label: 'Good' },
    { time: '17:00', score: 55, label: 'Fair' },
];

// AI topic suggestions
const aiTopicSuggestions: TopicSuggestion[] = [
    { topic: 'Redux Toolkit State Management', demand: 'high', reason: '45 students requested this topic' },
    { topic: 'React Query & Data Fetching', demand: 'high', reason: 'Trending in your course category' },
    { topic: 'Testing with Jest & RTL', demand: 'medium', reason: 'Common confusion in assignments' },
    { topic: 'Performance Optimization', demand: 'medium', reason: 'Related to recent course updates' },
];

const courses = [
    { id: '1', title: 'Complete React Masterclass' },
    { id: '2', title: 'Node.js Backend Development' },
    { id: '3', title: 'JavaScript Essentials' },
    { id: '4', title: 'TypeScript Mastery' },
];

const durations = [30, 45, 60, 90, 120, 180];

export default function ScheduleClassPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showAISuggestions, setShowAISuggestions] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [maxAttendees, setMaxAttendees] = useState(100);
    const [isPublic, setIsPublic] = useState(true);
    const [enableRecording, setEnableRecording] = useState(true);
    const [enableChat, setEnableChat] = useState(true);
    const [enableQA, setEnableQA] = useState(true);
    const [sendReminders, setSendReminders] = useState(true);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    // Set default date to tomorrow
    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
    }, []);

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

    const handleApplyAITime = (slot: TimeSlot) => {
        setTime(slot.time);
    };

    const handleApplyAITopic = (suggestion: TopicSuggestion) => {
        setTitle(suggestion.topic);
        setDescription(`Live session covering ${suggestion.topic}. This topic was ${suggestion.reason.toLowerCase()}.`);
    };

    const regenerateAISuggestions = () => {
        setAiLoading(true);
        setTimeout(() => setAiLoading(false), 1500);
    };

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Save to database
        await new Promise(resolve => setTimeout(resolve, 1500));

        router.push('/instructor/live');
    };

    const getDemandColor = (demand: TopicSuggestion['demand']) => {
        switch (demand) {
            case 'high': return 'text-[var(--error-400)] bg-[var(--error-500)]/10';
            case 'medium': return 'text-[var(--warning-400)] bg-[var(--warning-500)]/10';
            case 'low': return 'text-[var(--primary-400)] bg-[var(--primary-500)]/10';
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/instructor/live"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Live Classes
                </Link>
                <h1 className="text-2xl font-bold text-white">Schedule Live Class</h1>
                <p className="text-[var(--text-secondary)]">
                    Create a new live session for your students
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Form */}
                <div className="flex-1">
                    <form onSubmit={handleSchedule} className="space-y-6">
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
                                        <p className="text-xs text-[var(--text-tertiary)]">Anyone can join</p>
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
                                        <p className="text-xs text-[var(--text-tertiary)]">Invite only</p>
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
                            <Link href="/instructor/live" className="btn btn-secondary">
                                Cancel
                            </Link>
                            <button type="submit" className="btn btn-accent" disabled={loading}>
                                {loading ? 'Scheduling...' : 'Schedule Class'}
                                <Calendar className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* AI Suggestions Panel */}
                {showAISuggestions && (
                    <div className="lg:w-80 space-y-4">
                        <div className="glass-card p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">AI Suggestions</h3>
                                        <p className="text-xs text-[var(--text-tertiary)]">Powered by AI</p>
                                    </div>
                                </div>
                                <button
                                    onClick={regenerateAISuggestions}
                                    className="p-2 text-[var(--text-tertiary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)] transition-colors"
                                    disabled={aiLoading}
                                >
                                    <RefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* Optimal Time Slots */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Optimal Time Slots
                                </h4>
                                <div className="space-y-2">
                                    {aiTimeSlots.map((slot, index) => (
                                        <button
                                            key={slot.time}
                                            type="button"
                                            onClick={() => handleApplyAITime(slot)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${time === slot.time
                                                ? 'bg-[var(--primary-500)]/20 border border-[var(--primary-500)]'
                                                : 'bg-[var(--surface-glass)] border border-transparent hover:border-[var(--border-default)]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-white">{slot.time}</span>
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${index === 0
                                                    ? 'bg-[var(--success-500)]/20 text-[var(--success-400)]'
                                                    : 'bg-[var(--surface-glass)] text-[var(--text-tertiary)]'
                                                    }`}>
                                                    {slot.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-[var(--surface-glass)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] rounded-full"
                                                        style={{ width: `${slot.score}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-[var(--text-tertiary)]">{slot.score}%</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)] mt-2 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Based on your students' activity patterns
                                </p>
                            </div>

                            {/* Topic Suggestions */}
                            <div>
                                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Trending Topics
                                </h4>
                                <div className="space-y-2">
                                    {aiTopicSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.topic}
                                            type="button"
                                            onClick={() => handleApplyAITopic(suggestion)}
                                            className="w-full text-left p-3 bg-[var(--surface-glass)] rounded-lg border border-transparent hover:border-[var(--border-default)] transition-all"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-white">{suggestion.topic}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${getDemandColor(suggestion.demand)}`}>
                                                    {suggestion.demand}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[var(--text-tertiary)]">{suggestion.reason}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="glass-card p-4">
                            <h4 className="text-sm font-medium text-white mb-3">💡 Pro Tips</h4>
                            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 mt-0.5 text-[var(--success-400)]" />
                                    Schedule classes at least 24 hours in advance
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 mt-0.5 text-[var(--success-400)]" />
                                    Use descriptive titles for better discovery
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 mt-0.5 text-[var(--success-400)]" />
                                    Enable recording to let students rewatch
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 mt-0.5 text-[var(--success-400)]" />
                                    Add relevant tags for better searchability
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
