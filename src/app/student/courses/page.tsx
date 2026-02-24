'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Star,
    Users,
    Clock,
    BookOpen,
    Filter,
    X,
    ChevronDown,
    Loader2,
    SlidersHorizontal
} from 'lucide-react';

const categories = ['All', 'Development', 'Data Science', 'Design', 'Marketing', 'Cloud Computing'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
];

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');
    const [selectedSort, setSelectedSort] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCategory !== 'All') params.set('category', selectedCategory);
                if (selectedLevel !== 'All Levels') params.set('level', selectedLevel);
                if (searchQuery.trim()) params.set('q', searchQuery.trim());
                params.set('sort', selectedSort);

                const res = await fetch(`/api/courses?${params.toString()}`);
                if (res.ok) {
                    const json = await res.json();
                    setCourses(json);
                }
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [selectedCategory, selectedLevel, selectedSort, searchQuery]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Browse Courses</h1>
                    <p className="text-[var(--text-secondary)]">
                        {loading ? 'Loading...' : `${courses.length} courses available`}
                    </p>
                </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="glass-card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>

                    {/* Filter Toggle (Mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-secondary md:hidden"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Desktop Filters */}
                    <div className="hidden md:flex gap-3">
                        {/* Category */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input py-2 px-3 text-sm min-w-[140px]"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        {/* Level */}
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="input py-2 px-3 text-sm min-w-[130px]"
                        >
                            {levels.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="input py-2 px-3 text-sm min-w-[160px]"
                        >
                            {sortOptions.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mobile Filters Panel */}
                {showFilters && (
                    <div className="md:hidden mt-4 space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input py-2 px-3 text-sm w-full"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="input py-2 px-3 text-sm w-full"
                        >
                            {levels.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="input py-2 px-3 text-sm w-full"
                        >
                            {sortOptions.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'All' || selectedLevel !== 'All Levels') && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'All' && (
                        <span className="badge badge-primary flex items-center gap-1">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory('All')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {selectedLevel !== 'All Levels' && (
                        <span className="badge badge-primary flex items-center gap-1">
                            {selectedLevel}
                            <button onClick={() => setSelectedLevel('All Levels')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--primary-400)] animate-spin" />
                </div>
            )}

            {/* Course Grid */}
            {!loading && courses.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course._id}
                            href={`/student/courses/${course._id}`}
                            className="course-card group"
                        >
                            <div className="course-card-image relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-white/20" />
                                </div>
                                <span className="badge badge-primary absolute top-4 left-4">{course.category}</span>
                            </div>
                            <div className="course-card-content">
                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                                    <span>{course.level}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                        {course.rating || 0}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {(course.studentsCount || 0) >= 1000
                                            ? `${((course.studentsCount || 0) / 1000).toFixed(1)}K`
                                            : course.studentsCount || 0}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-[var(--primary-400)] transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mb-3">{course.instructor}</p>
                                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-3">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {course.lessonsCount} lessons
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                                    <span className="text-xl font-bold text-white">₹{course.price}</span>
                                    <span className="btn btn-sm btn-primary">Enroll Now</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && courses.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <BookOpen className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                        {searchQuery ? 'Try adjusting your search or filters' : 'No courses are available yet. Check back soon!'}
                    </p>
                    {(selectedCategory !== 'All' || selectedLevel !== 'All Levels' || searchQuery) && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedLevel('All Levels');
                                setSearchQuery('');
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
