// Type definitions for the Smart Learning Platform

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'student' | 'instructor';
    avatar_url?: string;
    bio?: string;
    created_at: string;
}

export interface Course {
    id: string;
    instructor_id: string;
    instructor?: User;
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    thumbnail_url?: string;
    is_published: boolean;
    created_at: string;
    lessons_count?: number;
    students_count?: number;
    rating?: number;
    duration_hours?: number;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    content?: string;
    video_url?: string;
    order_index: number;
    duration_minutes: number;
}

export interface Enrollment {
    id: string;
    student_id: string;
    course_id: string;
    course?: Course;
    progress: number;
    enrolled_at: string;
    completed_at?: string;
}

export interface Quiz {
    id: string;
    lesson_id: string;
    title: string;
    questions: QuizQuestion[];
    time_limit_minutes?: number;
    passing_score: number;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_option: number;
}

export interface QuizAttempt {
    id: string;
    quiz_id: string;
    student_id: string;
    score: number;
    answers: number[];
    completed_at: string;
}

export interface LiveSession {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    scheduled_at: string;
    duration_minutes: number;
    meeting_url?: string;
    is_completed: boolean;
}

export interface Certificate {
    id: string;
    student_id: string;
    course_id: string;
    course?: Course;
    issued_at: string;
    certificate_url: string;
}

export interface Payment {
    id: string;
    user_id: string;
    course_id?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripe_payment_id?: string;
    created_at: string;
}

// Dashboard Stats
export interface StudentStats {
    enrolled_courses: number;
    completed_courses: number;
    certificates_earned: number;
    total_learning_hours: number;
}

export interface InstructorStats {
    total_courses: number;
    total_students: number;
    total_earnings: number;
    avg_rating: number;
}

// Feature type for landing page
export interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}
