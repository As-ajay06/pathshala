'use client';

import Link from 'next/link';
import {
    BookOpen,
    Users,
    DollarSign,
    TrendingUp,
    Plus,
    Star,
    Eye,
    ArrowRight,
    ArrowUpRight,
    Calendar,
    Video,
    FileText,
    Bell
} from 'lucide-react';

// Mock data - will be replaced with Supabase queries
const instructorStats = [
    { icon: BookOpen, label: 'Total Courses', value: '8', change: '+2 this month', color: 'from-[var(--primary-500)] to-[var(--primary-700)]' },
    { icon: Users, label: 'Total Students', value: '12,450', change: '+1,230 this month', color: 'from-[var(--accent-500)] to-[var(--accent-700)]' },
    { icon: DollarSign, label: 'Total Earnings', value: '$24,580', change: '+$3,420 this month', color: 'from-green-500 to-green-700' },
    { icon: Star, label: 'Average Rating', value: '4.8', change: '↑ 0.2 from last month', color: 'from-yellow-500 to-orange-600' },
];

const myCourses = [
    {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        students: 4500,
        rating: 4.9,
        revenue: 8500,
        status: 'published',
        thumbnail: '/api/placeholder/400/225',
    },
    {
        id: '2',
        title: 'Advanced React Patterns',
        students: 2100,
        rating: 4.8,
        revenue: 4200,
        status: 'published',
        thumbnail: '/api/placeholder/400/225',
    },
    {
        id: '3',
        title: 'Node.js Microservices Architecture',
        students: 0,
        rating: 0,
        revenue: 0,
        status: 'draft',
        thumbnail: '/api/placeholder/400/225',
    },
];

const recentActivity = [
    { type: 'enrollment', message: '15 new students enrolled in Web Development', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review on React Patterns course', time: '4 hours ago' },
    { type: 'earning', message: 'You received $450 in course sales', time: '6 hours ago' },
    { type: 'question', message: '3 new questions on your courses', time: '1 day ago' },
];

const upcomingClasses = [
    { title: 'Live Q&A: JavaScript Best Practices', date: 'Today, 2:00 PM', students: 45 },
    { title: 'Workshop: Building REST APIs', date: 'Tomorrow, 10:00 AM', students: 32 },
    { title: 'Code Review Session', date: 'Jan 28, 3:00 PM', students: 28 },
];

const revenueData = [
    { month: 'Aug', amount: 2100 },
    { month: 'Sep', amount: 2800 },
    { month: 'Oct', amount: 3200 },
    { month: 'Nov', amount: 2900 },
    { month: 'Dec', amount: 3800 },
    { month: 'Jan', amount: 4200 },
];

export default function InstructorDashboard() {
    const maxRevenue = Math.max(...revenueData.map(d => d.amount));

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Welcome back, Sarah! 👋
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Here's what's happening with your courses today
                    </p>
                </div>
                <Link href="/instructor/courses/create" className="btn btn-accent">
                    <Plus className="w-4 h-4" />
                    Create New Course
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {instructorStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="stat-value">{stat.value}</p>
                            <p className="stat-label">{stat.label}</p>
                            <p className="text-xs text-[var(--success-400)] mt-1">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Revenue & Courses */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Revenue Chart */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Last 6 months</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">$19,000</p>
                                <p className="text-sm text-[var(--success-400)] flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +12% from last period
                                </p>
                            </div>
                        </div>

                        {/* Simple Bar Chart */}
                        <div className="flex items-end justify-between h-40 gap-2">
                            {revenueData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-gradient-to-t from-[var(--primary-600)] to-[var(--primary-400)] rounded-t-lg transition-all hover:opacity-80"
                                        style={{ height: `${(data.amount / maxRevenue) * 100}%` }}
                                    />
                                    <span className="text-xs text-[var(--text-tertiary)]">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Courses */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">My Courses</h2>
                            <Link href="/instructor/courses" className="text-sm text-[var(--primary-400)] hover:underline flex items-center gap-1">
                                View all
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {myCourses.map((course) => (
                                <div key={course.id} className="glass-card p-4 flex gap-4">
                                    <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-600)] flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-8 h-8 text-white/30" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-white truncate">{course.title}</h3>
                                            <span className={`badge flex-shrink-0 ${course.status === 'published' ? 'badge-success' : 'badge-primary'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {course.students.toLocaleString()} students
                                            </span>
                                            {course.rating > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                                                    {course.rating}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-[var(--success-400)]">
                                                <DollarSign className="w-3 h-3" />
                                                {course.revenue.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/instructor/courses/${course.id}/edit`}
                                        className="btn btn-sm btn-secondary self-center hidden md:flex"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Manage
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Live Classes */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Video className="w-5 h-5 text-[var(--accent-400)]" />
                            <h3 className="font-semibold text-white">Upcoming Classes</h3>
                        </div>

                        <div className="space-y-3">
                            {upcomingClasses.map((session, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg bg-[var(--surface-glass)] border border-[var(--border-subtle)] ${index === 0 ? 'border-l-2 border-l-[var(--accent-500)]' : ''
                                        }`}
                                >
                                    <p className="text-sm font-medium text-white mb-1">{session.title}</p>
                                    <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {session.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {session.students}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/instructor/live" className="btn btn-secondary w-full mt-4">
                            <Plus className="w-4 h-4" />
                            Schedule Class
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-[var(--primary-400)]" />
                            <h3 className="font-semibold text-white">Recent Activity</h3>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === 'enrollment'
                                            ? 'bg-[var(--primary-500)]/20 text-[var(--primary-400)]'
                                            : activity.type === 'review'
                                                ? 'bg-[var(--accent-500)]/20 text-[var(--accent-400)]'
                                                : activity.type === 'earning'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-[var(--surface-glass)] text-[var(--text-tertiary)]'
                                        }`}>
                                        {activity.type === 'enrollment' && <Users className="w-4 h-4" />}
                                        {activity.type === 'review' && <Star className="w-4 h-4" />}
                                        {activity.type === 'earning' && <DollarSign className="w-4 h-4" />}
                                        {activity.type === 'question' && <FileText className="w-4 h-4" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-[var(--text-secondary)] leading-snug">{activity.message}</p>
                                        <p className="text-xs text-[var(--text-tertiary)] mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-5">
                        <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/instructor/courses/create" className="btn btn-sm btn-secondary justify-start">
                                <Plus className="w-4 h-4" />
                                New Course
                            </Link>
                            <Link href="/instructor/live" className="btn btn-sm btn-secondary justify-start">
                                <Video className="w-4 h-4" />
                                Go Live
                            </Link>
                            <Link href="/instructor/quizzes" className="btn btn-sm btn-secondary justify-start">
                                <FileText className="w-4 h-4" />
                                Create Quiz
                            </Link>
                            <Link href="/instructor/earnings" className="btn btn-sm btn-secondary justify-start">
                                <DollarSign className="w-4 h-4" />
                                Withdraw
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
