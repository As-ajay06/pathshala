import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Video,
  Trophy,
  Globe,
  Shield,
  ArrowRight,
  Play,
  Star,
  Users,
  Clock,

  CheckCircle,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

// Fetch featured courses from DB
async function getFeaturedCourses() {
  try {
    await connectDB();
    const courses = await Course.find({ isPublished: true })
      .sort({ rating: -1, studentsCount: -1 })
      .limit(6)
      .populate('instructor', 'name')
      .lean();
    return courses.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      instructor: c.instructor?.name || 'Unknown',
      rating: c.rating || 0,
      students: c.studentsCount || 0,
      price: c.price || 0,
      category: c.category,
      level: c.level,
    }));
  } catch {
    return [];
  }
}

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Smart Course Discovery',
    description: 'AI-powered recommendations tailored to your learning goals and interests.'
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Live Interactive Classes',
    description: 'Join real-time sessions with instructors, Q&A, and collaborative learning.'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Progress Analytics',
    description: 'Track your learning journey with detailed insights and performance metrics.'
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Verified Certifications',
    description: 'Earn industry-recognized certificates upon course completion.'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Multilingual Support',
    description: 'Learn in your preferred language with accessibility-first design.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure Payments',
    description: 'Flexible payment options with enterprise-grade security.'
  },
];

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Software Developer',
    avatar: 'AT',
    content: 'LearnFlow transformed my career. The AI recommendations helped me find exactly what I needed to level up my skills.',
    rating: 5
  },
  {
    name: 'Maria Garcia',
    role: 'UX Designer',
    avatar: 'MG',
    content: 'The live classes feature is incredible. Being able to interact with instructors in real-time made all the difference.',
    rating: 5
  },
  {
    name: 'James Wilson',
    role: 'Data Analyst',
    avatar: 'JW',
    content: 'I earned 3 certifications in 6 months. The progress tracking kept me motivated throughout my learning journey.',
    rating: 5
  },
];

const stats = [
  { value: '50K+', label: 'Active Learners' },
  { value: '2,500+', label: 'Expert Courses' },
  { value: '500+', label: 'Verified Instructors' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default async function LandingPage() {
  const featuredCourses = await getFeaturedCourses();
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-content">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LearnFlow</span>
          </Link>

          <div className="nav-links hide-mobile">
            <Link href="/student/courses" className="nav-link">Courses</Link>
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#testimonials" className="nav-link">Testimonials</Link>
            <Link href="/auth/login" className="btn btn-ghost">Log in</Link>
            <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
          </div>

          <button className="btn btn-ghost hide-desktop" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="grid lg:grid-cols-2 gap-12 items-center pt-24">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--surface-glass) border border-[var(--border-subtle)] mb-6">
                <Sparkles className="w-4 h-4 text-(--accent-400)" />
                <span className="text-sm text-(--text-secondary)">AI-Powered Learning Platform</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Transform Your Future with{' '}
                <span className="gradient-text">Smart Learning</span>
              </h1>

              <p className="text-lg text-(--text-secondary) mb-8 max-w-xl">
                Join thousands of learners and instructors on the most advanced digital education platform.
                Personalized courses, live classes, and AI-driven recommendations.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/auth/signup" className="btn btn-primary btn-lg">
                  Start Learning Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/signup?role=instructor" className="btn btn-secondary btn-lg">
                  Become an Instructor
                </Link>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex -space-x-3">
                  {['SK', 'MK', 'SR', 'AP'].map((initials, i) => (
                    <div
                      key={i}
                      className="avatar border-2 border-background"
                      style={{
                        background: `linear-gradient(135deg, hsl(${220 + i * 30}, 70%, 60%), hsl(${240 + i * 30}, 70%, 50%))`
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-(--accent-400) text-(--accent-400)" />
                    ))}
                    <span className="text-sm text-white ml-1">4.9</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">From 10,000+ reviews</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in delay-200 hide-mobile">
              <div className="relative z-10">
                <div className="glass-card p-6 mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Web Development 101</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Lesson 5 of 24</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: '68%' }} />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">68% complete</p>
                </div>

                <div className="glass-card p-4 absolute -left-8 top-1/2 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--success-500)] flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Quiz Completed!</p>
                      <p className="text-xs text-[var(--text-secondary)]">Score: 95%</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 absolute -right-4 bottom-8 animate-float delay-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-500)] flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Certificate Earned!</p>
                      <p className="text-xs text-[var(--text-secondary)]">React Fundamentals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[var(--border-subtle)]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <p className="text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-glass)] border border-[var(--border-subtle)] mb-4">
              <Zap className="w-4 h-4 text-[var(--primary-400)]" />
              <span className="text-sm text-[var(--text-secondary)]">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools for students and instructors to thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-[var(--text-secondary)]">Start learning from the best instructors</p>
            </div>
            <Link href="/student/courses" className="btn btn-secondary hide-mobile">
              Browse All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => (
              <div
                key={course.id}
                className="course-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
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
                      {course.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students >= 1000 ? `${(course.students / 1000).toFixed(1)}K` : course.students}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">{course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">₹{course.price}</span>
                    <Link href={`/student/courses/${course.id}`} className="btn btn-sm btn-primary">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 hide-desktop">
            <Link href="/student/courses" className="btn btn-secondary">
              Browse All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              See what our community has to say about their learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--accent-400)] text-[var(--accent-400)]" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
                Join our community of learners and instructors. Start for free and upgrade anytime.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/signup" className="btn btn-primary btn-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/signup?role=instructor" className="btn btn-accent btn-lg">
                  Teach on LearnFlow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border-subtle)]">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LearnFlow</span>
              </Link>
              <p className="text-sm text-[var(--text-secondary)]">
                A scalable digital education ecosystem connecting educators and learners.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/student/courses" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link href="/auth/signup?role=instructor" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Become Instructor</Link></li>
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-subtle)] text-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              © 2026 LearnFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
