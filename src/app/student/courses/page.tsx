'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Star,
    Users,
    Clock,
    BookOpen,
    ChevronDown,
    X,
    SlidersHorizontal
} from 'lucide-react';

// Mock data - will be replaced with Supabase queries
const allCourses = [
    {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        instructor: 'Sarah Johnson',
        rating: 4.9,
        reviews: 2850,
        students: 12500,
        price: 89.99,
        originalPrice: 199.99,
        category: 'Development',
        level: 'Beginner',
        duration: '45 hours',
        lessons: 185,
    },
    {
        id: '2',
        title: 'Machine Learning A-Z: From Zero to Hero',
        instructor: 'Dr. Michael Chen',
        rating: 4.8,
        reviews: 1920,
        students: 8300,
        price: 129.99,
        originalPrice: 249.99,
        category: 'Data Science',
        level: 'Intermediate',
        duration: '52 hours',
        lessons: 210,
    },
    {
        id: '3',
        title: 'UI/UX Design Masterclass',
        instructor: 'Emily Rodriguez',
        rating: 4.9,
        reviews: 3100,
        students: 15200,
        price: 79.99,
        originalPrice: 149.99,
        category: 'Design',
        level: 'All Levels',
        duration: '32 hours',
        lessons: 120,
    },
    {
        id: '4',
        title: 'Advanced React & Next.js',
        instructor: 'Alex Morgan',
        rating: 4.7,
        reviews: 890,
        students: 5200,
        price: 99.99,
        originalPrice: 179.99,
        category: 'Development',
        level: 'Advanced',
        duration: '38 hours',
        lessons: 145,
    },
    {
        id: '5',
        title: 'Python for Data Analysis',
        instructor: 'Dr. James Wilson',
        rating: 4.8,
        reviews: 2100,
        students: 9800,
        price: 69.99,
        originalPrice: 129.99,
        category: 'Data Science',
        level: 'Beginner',
        duration: '28 hours',
        lessons: 95,
    },
    {
        id: '6',
        title: 'Digital Marketing Fundamentals',
        instructor: 'Lisa Thompson',
        rating: 4.6,
        reviews: 1450,
        students: 7200,
        price: 59.99,
        originalPrice: 99.99,
        category: 'Marketing',
        level: 'Beginner',
        duration: '24 hours',
        lessons: 80,
    },
    {
        id: '7',
        title: 'Mobile App Development with Flutter',
        instructor: 'David Kim',
        rating: 4.8,
        reviews: 980,
        students: 4500,
        price: 109.99,
        originalPrice: 199.99,
        category: 'Development',
        level: 'Intermediate',
        duration: '42 hours',
        lessons: 165,
    },
    {
        id: '8',
        title: 'AWS Cloud Practitioner Certification',
        instructor: 'Robert Taylor',
        rating: 4.9,
        reviews: 2300,
        students: 11000,
        price: 89.99,
        originalPrice: 159.99,
        category: 'Cloud Computing',
        level: 'Beginner',
        duration: '35 hours',
        lessons: 130,
    },
];

const categories = ['All', 'Development', 'Data Science', 'Design', 'Marketing', 'Cloud Computing'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');
    const [sortBy, setSortBy] = useState('Most Popular');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 200]);

    // Filter courses
    const filteredCourses = allCourses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
        const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    // Sort courses
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case 'Highest Rated':
                return b.rating - a.rating;
            case 'Price: Low to High':
                return a.price - b.price;
            case 'Price: High to Low':
                return b.price - a.price;
            case 'Most Popular':
            default:
                return b.students - a.students;
        }
    });

    const activeFiltersCount = [
        selectedCategory !== 'All',
        selectedLevel !== 'All Levels',
        priceRange[0] > 0 || priceRange[1] < 200,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Explore Courses</h1>
                <p className="text-[var(--text-secondary)]">
                    Discover {allCourses.length}+ courses to advance your career
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        placeholder="Search courses, instructors..."
                        className="input pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Toggle (Mobile) */}
                <button
                    className="btn btn-secondary md:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-[var(--primary-500)] text-white text-xs rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {/* Desktop Filters */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            className="input pr-10 appearance-none cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>

                    {/* Level Filter */}
                    <div className="relative">
                        <select
                            className="input pr-10 appearance-none cursor-pointer"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                        >
                            {levels.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            className="input pr-10 appearance-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
                <div className="md:hidden glass-card p-4 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Filters</h3>
                        <button onClick={() => setShowFilters(false)}>
                            <X className="w-5 h-5 text-[var(--text-secondary)]" />
                        </button>
                    </div>

                    <div>
                        <label className="input-label">Category</label>
                        <select
                            className="input"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="input-label">Level</label>
                        <select
                            className="input"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                        >
                            {levels.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="input-label">Sort By</label>
                        <select
                            className="input"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Active Filters */}
            {(selectedCategory !== 'All' || selectedLevel !== 'All Levels') && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'All' && (
                        <button
                            className="badge badge-primary flex items-center gap-1"
                            onClick={() => setSelectedCategory('All')}
                        >
                            {selectedCategory}
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    {selectedLevel !== 'All Levels' && (
                        <button
                            className="badge badge-primary flex items-center gap-1"
                            onClick={() => setSelectedLevel('All Levels')}
                        >
                            {selectedLevel}
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    <button
                        className="text-sm text-[var(--primary-400)] hover:underline"
                        onClick={() => {
                            setSelectedCategory('All');
                            setSelectedLevel('All Levels');
                            setSearchQuery('');
                        }}
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-[var(--text-secondary)]">
                Showing {sortedCourses.length} of {allCourses.length} courses
            </p>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedCourses.map((course, index) => (
                    <Link
                        key={course.id}
                        href={`/student/courses/${course.id}`}
                        className="course-card animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="course-card-image relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center">
                                <BookOpen className="w-16 h-16 text-white/20" />
                            </div>
                            <span className="badge badge-primary absolute top-3 left-3">{course.category}</span>
                            {course.originalPrice > course.price && (
                                <span className="badge badge-accent absolute top-3 right-3">
                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        <div className="course-card-content">
                            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                                <span className="badge">{course.level}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {course.duration}
                                </span>
                            </div>

                            <h3 className="font-semibold text-white mb-1 line-clamp-2 min-h-[2.5rem]">
                                {course.title}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">{course.instructor}</p>

                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                    <span className="text-sm font-medium text-white">{course.rating}</span>
                                </div>
                                <span className="text-xs text-[var(--text-tertiary)]">({course.reviews.toLocaleString()} reviews)</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                                <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                                    <Users className="w-3 h-3" />
                                    {course.students.toLocaleString()} students
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-white">${course.price}</span>
                                    {course.originalPrice > course.price && (
                                        <span className="text-xs text-[var(--text-tertiary)] line-through ml-1">
                                            ${course.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* No Results */}
            {sortedCourses.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                        Try adjusting your search or filters
                    </p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setSelectedCategory('All');
                            setSelectedLevel('All Levels');
                            setSearchQuery('');
                        }}
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
