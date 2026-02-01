'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    ArrowLeft,
    Star,
    Users,
    Clock,
    BookOpen,
    Play,
    CheckCircle,
    Globe,
    Award,
    Video,
    FileText,
    Download,
    ChevronDown,
    ChevronUp,
    Heart,
    Share2,
    ShoppingCart,
    Loader2
} from 'lucide-react';

// Declare Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}

// Mock data - replace with Supabase query
const courseData = {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    subtitle: 'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, JavaScript, React, Node, MongoDB, and more!',
    instructor: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        title: 'Senior Software Engineer',
        rating: 4.9,
        students: 125000,
        courses: 12,
        bio: '10+ years of experience in web development. Former Google engineer.',
    },
    rating: 4.9,
    reviewsCount: 2850,
    students: 12500,
    price: 89.99,
    originalPrice: 199.99,
    category: 'Development',
    level: 'Beginner',
    duration: '45 hours',
    lessons: 185,
    lastUpdated: 'January 2026',
    language: 'English',
    features: [
        '45 hours on-demand video',
        '15 coding exercises',
        '12 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
        'Access on mobile and TV',
    ],
    whatYouWillLearn: [
        'Build 25+ websites and web apps from scratch',
        'Master HTML5, CSS3, JavaScript, React, Node.js',
        'Create responsive layouts with Flexbox and Grid',
        'Work with APIs and databases (MongoDB, SQL)',
        'Deploy websites to production',
        'Build a professional portfolio',
    ],
    curriculum: [
        {
            id: '1',
            title: 'Introduction to Web Development',
            lessons: [
                { id: '1-1', title: 'Welcome to the Course', duration: '5:30', type: 'video', preview: true },
                { id: '1-2', title: 'How the Web Works', duration: '12:45', type: 'video' },
                { id: '1-3', title: 'Setting Up Your Environment', duration: '8:20', type: 'video' },
                { id: '1-4', title: 'Your First HTML Page', duration: '15:00', type: 'video' },
            ],
        },
        {
            id: '2',
            title: 'HTML Fundamentals',
            lessons: [
                { id: '2-1', title: 'HTML Document Structure', duration: '10:15', type: 'video' },
                { id: '2-2', title: 'Text Elements & Typography', duration: '14:30', type: 'video' },
                { id: '2-3', title: 'Links and Navigation', duration: '11:00', type: 'video' },
                { id: '2-4', title: 'Images and Media', duration: '13:45', type: 'video' },
                { id: '2-5', title: 'HTML Practice Exercise', duration: '20:00', type: 'exercise' },
            ],
        },
        {
            id: '3',
            title: 'CSS Styling',
            lessons: [
                { id: '3-1', title: 'Introduction to CSS', duration: '8:00', type: 'video' },
                { id: '3-2', title: 'Selectors and Specificity', duration: '16:30', type: 'video' },
                { id: '3-3', title: 'Box Model Deep Dive', duration: '12:15', type: 'video' },
                { id: '3-4', title: 'Flexbox Layout', duration: '22:00', type: 'video' },
                { id: '3-5', title: 'CSS Grid', duration: '25:00', type: 'video' },
            ],
        },
        {
            id: '4',
            title: 'JavaScript Essentials',
            lessons: [
                { id: '4-1', title: 'Variables and Data Types', duration: '14:00', type: 'video' },
                { id: '4-2', title: 'Functions and Scope', duration: '18:30', type: 'video' },
                { id: '4-3', title: 'DOM Manipulation', duration: '20:00', type: 'video' },
                { id: '4-4', title: 'Events and Handlers', duration: '16:45', type: 'video' },
            ],
        },
    ],
    studentReviews: [
        {
            id: '1',
            user: 'Alex Thompson',
            avatar: 'AT',
            rating: 5,
            date: '2 weeks ago',
            content: 'This course completely transformed my understanding of web development. Sarah explains complex concepts in a very approachable way. Highly recommended!',
        },
        {
            id: '2',
            user: 'Maria Garcia',
            avatar: 'MG',
            rating: 5,
            date: '1 month ago',
            content: 'Best investment I\'ve made in my career. The projects are practical and the curriculum is up-to-date.',
        },
        {
            id: '3',
            user: 'James Wilson',
            avatar: 'JW',
            rating: 4,
            date: '1 month ago',
            content: 'Great course overall. Some sections could be more in-depth but definitely worth the price.',
        },
    ],
};

function CourseDetailContent() {
    const params = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [expandedSections, setExpandedSections] = useState<string[]>(['1']);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // Load Razorpay script
    const loadRazorpayScript = useCallback((): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, []);

    // Handle Razorpay Payment
    const handleBuyNow = useCallback(async () => {
        if (!session?.user) {
            router.push('/auth/signin?callbackUrl=' + window.location.href);
            return;
        }

        setPaymentLoading(true);
        setPaymentError(null);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load payment gateway');
            }

            // Create order on server
            const orderResponse = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: courseData.id,
                    userId: (session.user as any).id || session.user.email,
                    amount: courseData.price,
                    currency: 'INR',
                    courseName: courseData.title,
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Initialize Razorpay checkout
            const razorpayOptions = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'LearnFlow',
                description: `Purchase: ${courseData.title}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment on server
                        const verifyResponse = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.verified) {
                            alert('🎉 Payment Successful! You are now enrolled in this course.');
                            router.push(`/student/my-courses?enrolled=true&course=${courseData.id}`);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err: any) {
                        setPaymentError(err.message);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: session.user.name || '',
                    email: session.user.email || '',
                },
                theme: {
                    color: '#6366F1',
                },
                modal: {
                    ondismiss: function () {
                        setPaymentLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.on('payment.failed', function (response: any) {
                setPaymentError('Payment failed. Please try again.');
                setPaymentLoading(false);
            });
            razorpay.open();
        } catch (err: any) {
            setPaymentError(err.message);
            alert('Failed to initiate payment: ' + err.message);
        } finally {
            setPaymentLoading(false);
        }
    }, [session, router, loadRazorpayScript]);

    // Check for success param from payment redirect
    useEffect(() => {
        const enrolled = searchParams.get('enrolled');
        if (enrolled === 'true') {
            // User was redirected from successful enrollment
            router.replace(`/student/courses/${params.id}`);
        }
    }, [searchParams, params.id, router]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const totalLessons = courseData.curriculum.reduce((acc, section) => acc + section.lessons.length, 0);

    return (
        <div className="animate-fade-in">
            {/* Back Button */}
            <Link
                href="/student/courses"
                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Course Header */}
                    <div>
                        <span className="badge badge-primary mb-3">{courseData.category}</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{courseData.title}</h1>
                        <p className="text-[var(--text-secondary)] mb-4">{courseData.subtitle}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                <span className="font-medium text-white">{courseData.rating}</span>
                                <span className="text-[var(--text-tertiary)]">({courseData.reviewsCount.toLocaleString()} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                <Users className="w-4 h-4" />
                                {courseData.students.toLocaleString()} students
                            </div>
                            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                <Clock className="w-4 h-4" />
                                {courseData.duration}
                            </div>
                            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                <Globe className="w-4 h-4" />
                                {courseData.language}
                            </div>
                        </div>
                    </div>

                    {/* Instructor */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-medium text-[var(--text-tertiary)] mb-3">Instructor</h3>
                        <div className="flex items-start gap-4">
                            <div className="avatar avatar-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)]">
                                {courseData.instructor.avatar}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">{courseData.instructor.name}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mb-2">{courseData.instructor.title}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                        {courseData.instructor.rating} rating
                                    </span>
                                    <span>{courseData.instructor.students.toLocaleString()} students</span>
                                    <span>{courseData.instructor.courses} courses</span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">{courseData.instructor.bio}</p>
                            </div>
                        </div>
                    </div>

                    {/* What You'll Learn */}
                    <div className="glass-card p-5">
                        <h3 className="text-lg font-semibold text-white mb-4">What You'll Learn</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {courseData.whatYouWillLearn.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-[var(--success-400)] flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Course Curriculum</h3>
                            <span className="text-sm text-[var(--text-secondary)]">
                                {courseData.curriculum.length} sections • {totalLessons} lessons
                            </span>
                        </div>

                        <div className="space-y-2">
                            {courseData.curriculum.map((section) => (
                                <div key={section.id} className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                                    <button
                                        className="w-full flex items-center justify-between p-4 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] transition-colors"
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedSections.includes(section.id) ? (
                                                <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                                            )}
                                            <span className="font-medium text-white">{section.title}</span>
                                        </div>
                                        <span className="text-sm text-[var(--text-tertiary)]">{section.lessons.length} lessons</span>
                                    </button>

                                    {expandedSections.includes(section.id) && (
                                        <div className="border-t border-[var(--border-subtle)]">
                                            {section.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center gap-3 p-4 hover:bg-[var(--surface-glass)] transition-colors border-b border-[var(--border-subtle)] last:border-b-0"
                                                >
                                                    {lesson.type === 'video' ? (
                                                        <Play className="w-4 h-4 text-[var(--text-tertiary)]" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
                                                    )}
                                                    <span className="flex-1 text-sm text-[var(--text-secondary)]">{lesson.title}</span>
                                                    {lesson.preview && (
                                                        <span className="badge badge-primary text-xs">Preview</span>
                                                    )}
                                                    <span className="text-xs text-[var(--text-tertiary)]">{lesson.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Student Reviews</h3>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                <span className="font-bold text-white">{courseData.rating}</span>
                                <span className="text-sm text-[var(--text-tertiary)]">({courseData.reviewsCount.toLocaleString()} reviews)</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {courseData.studentReviews.map((review) => (
                                <div key={review.id} className="p-4 bg-[var(--surface-glass)] rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="avatar">{review.avatar}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white">{review.user}</span>
                                                <span className="text-xs text-[var(--text-tertiary)]">{review.date}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? 'fill-[var(--accent-400)] text-[var(--accent-400)]' : 'text-[var(--text-tertiary)]'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)]">{review.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 text-sm text-[var(--primary-400)] hover:underline">
                            View all reviews
                        </button>
                    </div>
                </div>

                {/* Sidebar - Purchase Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-5 sticky top-24">
                        {/* Course Preview */}
                        <div className="relative mb-4 rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center">
                                <BookOpen className="w-20 h-20 text-white/20" />
                            </div>
                            <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                </div>
                            </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl font-bold text-white">${courseData.price}</span>
                            <span className="text-lg text-[var(--text-tertiary)] line-through">${courseData.originalPrice}</span>
                            <span className="badge badge-accent">
                                {Math.round((1 - courseData.price / courseData.originalPrice) * 100)}% OFF
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                className="btn btn-primary w-full btn-lg"
                                onClick={handleBuyNow}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        Buy Now - ₹{Math.round(courseData.price * 83)}
                                    </>
                                )}
                            </button>
                            {paymentError && (
                                <p className="text-sm text-[var(--error-400)] text-center">{paymentError}</p>
                            )}
                            <button className="btn btn-secondary w-full">
                                Add to Cart
                            </button>
                            <div className="flex gap-2">
                                <button
                                    className={`btn flex-1 ${isWishlisted ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                >
                                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                                    Wishlist
                                </button>
                                <button className="btn btn-ghost flex-1">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Course Includes */}
                        <div>
                            <h4 className="font-medium text-white mb-3">This course includes:</h4>
                            <ul className="space-y-2">
                                {courseData.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                        {index === 0 && <Video className="w-4 h-4 text-[var(--text-tertiary)]" />}
                                        {index === 1 && <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />}
                                        {index === 2 && <Download className="w-4 h-4 text-[var(--text-tertiary)]" />}
                                        {index === 3 && <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />}
                                        {index === 4 && <Award className="w-4 h-4 text-[var(--text-tertiary)]" />}
                                        {index === 5 && <Globe className="w-4 h-4 text-[var(--text-tertiary)]" />}
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Money Back Guarantee */}
                        <div className="mt-6 p-3 bg-[var(--surface-glass)] rounded-lg text-center">
                            <p className="text-sm text-[var(--text-secondary)]">
                                30-Day Money-Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CourseDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <CourseDetailContent />
        </Suspense>
    );
}
