'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Star,
    Users,
    Clock,
    BookOpen,
    Play,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    Globe,
    Award,
    ShoppingCart,
    Loader2,
    Video,
    FileText
} from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`/api/courses/${courseId}`);
                if (res.ok) {
                    const json = await res.json();
                    setCourse(json);
                } else {
                    console.error('Course not found');
                }
            } catch (err) {
                console.error('Failed to fetch course:', err);
            } finally {
                setLoading(false);
            }
        }
        if (courseId) fetchCourse();
    }, [courseId]);

    const toggleSection = (index: number) => {
        const newSet = new Set(expandedSections);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setExpandedSections(newSet);
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            });
            const data = await res.json();

            if (data.sessionUrl) {
                // Stripe checkout
                window.location.href = data.sessionUrl;
            } else if (data.orderId) {
                // Razorpay
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: data.currency || 'INR',
                    name: 'LearnFlow',
                    description: course?.title,
                    order_id: data.orderId,
                    handler: async function (response: any) {
                        await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                courseId,
                            }),
                        });
                        router.push('/student/my-courses');
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            console.error('Enrollment error:', err);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--primary-400)] animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Course Not Found</h2>
                <p className="text-[var(--text-secondary)] mb-4">The course you're looking for doesn't exist.</p>
                <Link href="/student/courses" className="btn btn-primary">Browse Courses</Link>
            </div>
        );
    }

    const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor || 'Unknown';
    const totalLessons = course.lessons?.length || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Back Button */}
            <Link href="/student/courses" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course Header */}
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {course.category && <span className="badge badge-primary">{course.category}</span>}
                            {course.level && <span className="badge badge-secondary">{course.level}</span>}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{course.title}</h1>
                        <p className="text-[var(--text-secondary)] mb-4">{course.description}</p>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                {course.rating || 0} ({course.reviewsCount || 0} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {(course.studentsCount || 0).toLocaleString()} students
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {totalLessons} lessons
                            </span>
                            {course.language && (
                                <span className="flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    {course.language}
                                </span>
                            )}
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-3 mt-4 p-3 glass-card">
                            <div className="avatar bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)]">
                                {instructorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-secondary)]">Created by</p>
                                <p className="font-medium text-white">{instructorName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum */}
                    {course.lessons && course.lessons.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Course Content</h2>
                            <div className="space-y-2">
                                {course.lessons.map((lesson: any, index: number) => (
                                    <div key={index} className="glass-card overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(index)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-glass)] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-7 h-7 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-400)] flex items-center justify-center text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                                <span className="font-medium text-white text-left">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {lesson.duration && (
                                                    <span className="text-xs text-[var(--text-tertiary)]">{lesson.duration}</span>
                                                )}
                                                {expandedSections.has(index) ? (
                                                    <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                                                )}
                                            </div>
                                        </button>
                                        {expandedSections.has(index) && lesson.content && (
                                            <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
                                                <p className="text-sm text-[var(--text-secondary)] pt-3">{lesson.content}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-3">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {course.tags.map((tag: string, index: number) => (
                                    <span key={index} className="badge badge-secondary">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Price Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        {/* Preview */}
                        <div className="w-full h-40 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl font-bold text-white">₹{course.price || 0}</span>
                        </div>

                        {/* Enroll Button */}
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="btn btn-primary w-full py-3 text-base mb-4"
                        >
                            {enrolling ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Enroll Now
                                </>
                            )}
                        </button>

                        {/* Course Includes */}
                        <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                            <h3 className="font-semibold text-white text-sm mb-2">This course includes:</h3>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Video className="w-4 h-4 text-[var(--primary-400)]" />
                                {totalLessons} video lessons
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Award className="w-4 h-4 text-[var(--primary-400)]" />
                                Certificate of completion
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Clock className="w-4 h-4 text-[var(--primary-400)]" />
                                Lifetime access
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
