'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    // Redirect if already logged in
    useEffect(() => {
        if (session?.user) {
            const role = (session.user as any).role;
            if (role === 'instructor') {
                router.push('/instructor/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        }
    }, [session, router]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputElement = useRef<HTMLInputElement>(null);

    // Show registered success message
    useEffect(() => {
        inputElement.current?.focus();
        if (searchParams.get('registered') === 'true') {
            setError('Account created! Please log in.');
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/student/dashboard' });
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-(--primary-600) to-(--primary-900)" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-(--primary-400)/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-(--accent-400)/20 rounded-full blur-3xl animate-pulse delay-500" />

                <div className="relative z-10 flex flex-col justify-center p-12">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">LearnFlow</span>
                    </Link>

                    <h2 className="text-4xl font-bold text-white mb-4">
                        Welcome Back!
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-md">
                        Continue your learning journey with personalized courses and AI-powered recommendations.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-white" />
                            <span className="text-xl font-bold text-white">LearnFlow</span>
                        </Link>
                    </div>

                    <div className="glass-card p-8">
                        <h1 className="text-2xl font-bold text-(--primary-500) mb-2">Log In</h1>
                        <p className="text-(--text-secondary) mb-6">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-(--primary-500) hover:underline">
                                Sign up
                            </Link>
                        </p>

                        {error && (
                            <div className={`mb-4 p-3 rounded-lg border text-sm ${error.includes('Account')
                                ? 'bg-(--success-500)/10 border-(--success-500)/30 text-(--success-400)'
                                : 'bg-(--error-500)/10 border-(--error-500)/30 text-(--error-400)'
                                }`}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="form-group">
                                <label className="input-label ">Email</label>
                                <div className="relative">
                                    {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" /> */}
                                    <input
                                        type="email"
                                        ref={inputElement}
                                        className="input pl-10"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="input-label mb-0">Password</label>
                                    <Link href="/auth/forgot-password" className="text-xs text-[var(--primary-400)] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" /> */}
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input pl-10 pr-10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Log In'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="form-divider">or continue with</div>

                        <button
                            type="button"
                            className="social-btn"
                            onClick={handleGoogleLogin}
                        >
                            <Chrome className="w-5 h-5" />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
            <div className="animate-pulse text-white">Loading...</div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginForm />
        </Suspense>
    );
}
