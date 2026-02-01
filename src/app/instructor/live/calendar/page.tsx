'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Plus,
    Video,
    Clock,
    Users,
    Calendar as CalendarIcon,
    MoreVertical,
    Edit,
    Trash2,
    Play
} from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    duration: number;
    status: 'scheduled' | 'live' | 'completed';
    attendees: number;
}

const mockEvents: CalendarEvent[] = [
    { id: '1', title: 'Advanced React Patterns', date: new Date(2026, 0, 26, 19, 0), time: '19:00', duration: 90, status: 'scheduled', attendees: 45 },
    { id: '2', title: 'Live Coding: REST API', date: new Date(2026, 0, 27, 20, 0), time: '20:00', duration: 120, status: 'scheduled', attendees: 32 },
    { id: '3', title: 'Q&A Session', date: new Date(2026, 0, 28, 18, 0), time: '18:00', duration: 60, status: 'scheduled', attendees: 28 },
    { id: '4', title: 'TypeScript Deep Dive', date: new Date(2026, 0, 30, 19, 0), time: '19:00', duration: 90, status: 'scheduled', attendees: 55 },
    { id: '5', title: 'Node.js Basics', date: new Date(2026, 0, 25, 19, 0), time: '19:00', duration: 60, status: 'completed', attendees: 78 },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function LiveCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 25));
    const [view, setView] = useState<'month' | 'week'>('month');
    const [events] = useState<CalendarEvent[]>(mockEvents);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty slots for days before the first day
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        return events.filter(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        );
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date(2026, 0, 25); // Mock today's date
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const getStatusColor = (status: CalendarEvent['status']) => {
        switch (status) {
            case 'live': return 'bg-[var(--error-500)]';
            case 'scheduled': return 'bg-[var(--primary-500)]';
            case 'completed': return 'bg-[var(--success-500)]';
        }
    };

    const days = getDaysInMonth(currentDate);

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
                    <h1 className="text-2xl font-bold text-white">Class Calendar</h1>
                </div>
                <Link href="/instructor/live/schedule" className="btn btn-accent">
                    <Plus className="w-4 h-4" />
                    Schedule Class
                </Link>
            </div>

            <div className="glass-card overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 hover:bg-[var(--surface-glass)] rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
                        </button>
                        <h2 className="text-lg font-semibold text-white">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 hover:bg-[var(--surface-glass)] rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentDate(new Date(2026, 0, 25))}
                            className="btn btn-sm btn-secondary"
                        >
                            Today
                        </button>
                        <div className="flex rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                            <button
                                onClick={() => setView('month')}
                                className={`px-3 py-1.5 text-sm ${view === 'month'
                                    ? 'bg-[var(--accent-500)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setView('week')}
                                className={`px-3 py-1.5 text-sm ${view === 'week'
                                    ? 'bg-[var(--accent-500)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                Week
                            </button>
                        </div>
                    </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 border-b border-[var(--border-subtle)]">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-[var(--text-secondary)]">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const dayEvents = getEventsForDate(day);
                        const isCurrentDay = isToday(day);

                        return (
                            <div
                                key={index}
                                className={`min-h-[120px] p-2 border-b border-r border-[var(--border-subtle)] ${!day ? 'bg-[var(--bg-tertiary)]/30' : 'hover:bg-[var(--surface-glass)]'
                                    } ${index % 7 === 6 ? 'border-r-0' : ''}`}
                            >
                                {day && (
                                    <>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1 ${isCurrentDay
                                            ? 'bg-[var(--accent-500)] text-white font-semibold'
                                            : 'text-[var(--text-secondary)]'
                                            }`}>
                                            {day.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 2).map((event) => (
                                                <button
                                                    key={event.id}
                                                    onClick={() => setSelectedEvent(event)}
                                                    className={`w-full text-left px-2 py-1 rounded text-xs truncate ${getStatusColor(event.status)} text-white hover:opacity-90 transition-opacity`}
                                                >
                                                    {event.time} {event.title}
                                                </button>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <p className="text-xs text-[var(--text-tertiary)] px-2">
                                                    +{dayEvents.length - 2} more
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upcoming Classes Summary */}
            <div className="mt-8 glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Classes</h3>
                <div className="space-y-3">
                    {events
                        .filter(e => e.status === 'scheduled')
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .slice(0, 5)
                        .map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-4 bg-[var(--surface-glass)] rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                                        <Video className="w-6 h-6 text-[var(--primary-400)]" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{event.title}</p>
                                        <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3" />
                                                {event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {event.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {event.attendees} registered
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/instructor/live/${event.id}`} className="btn btn-sm btn-secondary">
                                        View
                                    </Link>
                                    <Link href={`/instructor/live/${event.id}/studio`} className="btn btn-sm btn-primary">
                                        <Play className="w-4 h-4" />
                                        Start
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
                    <div className="glass-card p-6 max-w-md mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{selectedEvent.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {selectedEvent.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-[var(--text-tertiary)] hover:text-white">
                                ×
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                                <span className="text-[var(--text-secondary)]">{selectedEvent.time} • {selectedEvent.duration} mins</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
                                <span className="text-[var(--text-secondary)]">{selectedEvent.attendees} registered</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/instructor/live/${selectedEvent.id}`} className="flex-1 btn btn-secondary">
                                View Details
                            </Link>
                            <Link href={`/instructor/live/${selectedEvent.id}/studio`} className="flex-1 btn btn-accent">
                                <Play className="w-4 h-4" />
                                Start Class
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
