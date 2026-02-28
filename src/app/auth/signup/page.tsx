'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
    GraduationCap,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Chrome,
    User,
    BookOpen,
    Presentation,
    Check
} from 'lucide-react';

type Role = 'student' | 'instructor';

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultRole = (searchParams.get('role') as Role) || 'student';

    const [step, setStep] = useState<'role' | 'details'>(searchParams.get('role') ? 'details' : 'role');
    const [role, setRole] = useState<Role>(defaultRole);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep('details');
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            const loginRes = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (loginRes?.error) {
                router.push('/auth/login?registered=true');
                return;
            }

            if (role === 'instructor') {
                router.push('/instructor/dashboard');
            } else {
                router.push('/student/dashboard');
            }

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        signIn('google', {
            callbackUrl: role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'
        });
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-600)] to-[var(--primary-900)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-[var(--primary-400)]/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[var(--accent-400)]/20 rounded-full blur-3xl animate-pulse delay-500" />

                <div className="relative z-10 flex flex-col justify-center p-12">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">LearnFlow</span>
                    </Link>

                    <h2 className="text-4xl font-bold text-white mb-4">
                        {role === 'instructor' ? 'Share Your Knowledge' : 'Start Learning Today'}
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-md">
                        {role === 'instructor'
                            ? 'Create courses, conduct live classes, and earn from your expertise.'
                            : 'Access thousands of courses and accelerate your career growth.'}
                    </p>

                    <div className="grid gap-4 max-w-md">
                        {(role === 'instructor' ? [
                            'Create unlimited courses',
                            'Earn up to 70% revenue share',
                            'Host live interactive classes',
                            'Track student analytics',
                        ] : [
                            'Access 2,500+ expert courses',
                            'AI-powered recommendations',
                            'Earn verified certificates',
                            'Join live sessions',
                        ]).map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-white/90">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">LearnFlow</span>
                        </Link>
                    </div>

                    {step === 'role' ? (
                        <div className="glass-card p-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Join LearnFlow</h1>
                            <p className="text-[var(--text-secondary)] mb-8">
                                Choose how you want to use the platform
                            </p>

                            <div className="grid gap-4">
                                <button
                                    onClick={() => handleRoleSelect('student')}
                                    className="glass-card p-6 text-left hover:border-[var(--primary-500)] transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">I want to Learn</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Browse courses, join live classes, and earn certificates
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('instructor')}
                                    className="glass-card p-6 text-left hover:border-[var(--accent-500)] transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Presentation className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">I want to Teach</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Create courses, host live sessions, and earn revenue
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-[var(--primary-400)] hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="glass-card p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
                                    <p className="text-[var(--text-secondary)]">
                                        Sign up as{' '}
                                        <span className={role === 'instructor' ? 'text-[var(--accent-400)]' : 'text-[var(--primary-400)]'}>
                                            {role === 'instructor' ? 'Instructor' : 'Student'}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep('role')}
                                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                                >
                                    Change role
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-[var(--error-500)]/10 border border-[var(--error-500)]/30 text-[var(--error-400)] text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="form-group">
                                    <label className="input-label">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                        <input
                                            type="text"
                                            className="input pl-10"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                        <input
                                            type="email"
                                            className="input pl-10"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="input pl-10 pr-10"
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            minLength={8}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-white transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 w-4 h-4 rounded border-[var(--border-default)] bg-transparent text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <label htmlFor="terms" className="text-sm text-[var(--text-secondary)]">
                                        I agree to the{' '}
                                        <Link href="#" className="text-[var(--primary-400)] hover:underline">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link href="#" className="text-[var(--primary-400)] hover:underline">Privacy Policy</Link>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className={`btn w-full ${role === 'instructor' ? 'btn-accent' : 'btn-primary'}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>

                            <div className="form-divider">or sign up with</div>

                            <button
                                type="button"
                                className="social-btn"
                                onClick={handleGoogleSignup}
                            >
                                <Chrome className="w-5 h-5" />
                                Continue with Google
                            </button>

                            <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-[var(--primary-400)] hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SignupLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
            <div className="animate-pulse text-white">Loading...</div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<SignupLoading />}>
            <SignupForm />
        </Suspense>
    );
}
