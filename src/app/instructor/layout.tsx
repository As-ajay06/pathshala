'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    GraduationCap,
    LayoutDashboard,
    BookOpen,
    Video,
    FileQuestion,
    Users,
    DollarSign,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    Menu,
    X,
    Plus
} from 'lucide-react';
import { useState } from 'react';

const instructorNavItems = [
    { href: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/instructor/courses', icon: BookOpen, label: 'My Courses' },
    { href: '/instructor/courses/create', icon: Plus, label: 'Create Course' },
    { href: '/instructor/live', icon: Video, label: 'Live Classes' },
    { href: '/instructor/quizzes', icon: FileQuestion, label: 'Quizzes' },
    { href: '/instructor/students', icon: Users, label: 'Students' },
    { href: '/instructor/earnings', icon: DollarSign, label: 'Earnings' },
    { href: '/instructor/settings', icon: Settings, label: 'Settings' },
];

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userName = session?.user?.name || 'Instructor';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)]
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)] flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">LearnFlow</span>
                                <span className="block text-xs text-[var(--accent-400)]">Instructor</span>
                            </div>
                        </Link>
                        <button
                            className="lg:hidden text-[var(--text-secondary)] hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {instructorNavItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/instructor/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-link ${isActive ? 'active !bg-[var(--accent-500)]/15 !text-[var(--accent-400)]' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <button
                        className="sidebar-link text-[var(--error-400)] hover:bg-[var(--error-500)]/10"
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:ml-[280px]">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-[var(--text-secondary)] hover:text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                <input
                                    type="text"
                                    placeholder="Search courses, students..."
                                    className="input pl-10 py-2"
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Create Course Button */}
                            <Link href="/instructor/courses/create" className="btn btn-accent hidden md:flex">
                                <Plus className="w-4 h-4" />
                                Create Course
                            </Link>

                            {/* Notifications */}
                            <button className="relative p-2 text-[var(--text-secondary)] hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent-500)] rounded-full" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <div className="avatar bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)]">{userInitials}</div>
                                    <span className="hidden md:block text-sm font-medium text-white">{userName}</span>
                                    <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 animate-fade-in">
                                        <Link href="/instructor/settings" className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                            Settings
                                        </Link>
                                        <Link href="/student/dashboard" className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-glass)]">
                                            Switch to Student
                                        </Link>
                                        <button
                                            className="w-full text-left px-3 py-2 text-sm text-[var(--error-400)] rounded-lg hover:bg-[var(--error-500)]/10"
                                            onClick={() => signOut({ callbackUrl: '/auth/login' })}
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
