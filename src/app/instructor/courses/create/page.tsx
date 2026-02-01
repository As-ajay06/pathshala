'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Plus,
    Trash2,
    Upload,
    Video,
    FileText,
    DollarSign,
    Globe,
    Clock,
    BookOpen,
    GripVertical,
    ChevronDown,
    ChevronUp,
    X,
    Image as ImageIcon,
    Save
} from 'lucide-react';

type Step = 'basics' | 'curriculum' | 'pricing' | 'publish';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz';
    duration: string;
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
    isExpanded: boolean;
}

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'basics', label: 'Basic Info', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum', icon: <FileText className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'publish', label: 'Publish', icon: <Check className="w-4 h-4" /> },
];

const categories = [
    'Development',
    'Data Science',
    'Design',
    'Marketing',
    'Business',
    'Cloud Computing',
    'Other',
];

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Other'];

export default function CreateCoursePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>('basics');
    const [loading, setLoading] = useState(false);

    // Form State - Basics
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('');
    const [language, setLanguage] = useState('English');

    // Form State - Curriculum
    const [sections, setSections] = useState<Section[]>([
        {
            id: '1',
            title: 'Introduction',
            isExpanded: true,
            lessons: [
                { id: '1-1', title: 'Welcome to the Course', type: 'video', duration: '' },
            ],
        },
    ]);

    // Form State - Pricing
    const [price, setPrice] = useState('');
    const [isFree, setIsFree] = useState(false);

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    const addSection = () => {
        const newId = String(sections.length + 1);
        setSections([
            ...sections,
            {
                id: newId,
                title: `Section ${newId}`,
                isExpanded: true,
                lessons: [],
            },
        ]);
    };

    const addLesson = (sectionId: string) => {
        setSections(sections.map((section) => {
            if (section.id === sectionId) {
                const newLessonId = `${sectionId}-${section.lessons.length + 1}`;
                return {
                    ...section,
                    lessons: [
                        ...section.lessons,
                        { id: newLessonId, title: '', type: 'video', duration: '' },
                    ],
                };
            }
            return section;
        }));
    };

    const updateLesson = (sectionId: string, lessonId: string, field: keyof Lesson, value: string) => {
        setSections(sections.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map((lesson) => {
                        if (lesson.id === lessonId) {
                            return { ...lesson, [field]: value };
                        }
                        return lesson;
                    }),
                };
            }
            return section;
        }));
    };

    const removeLesson = (sectionId: string, lessonId: string) => {
        setSections(sections.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.filter((l) => l.id !== lessonId),
                };
            }
            return section;
        }));
    };

    const toggleSection = (sectionId: string) => {
        setSections(sections.map((section) => {
            if (section.id === sectionId) {
                return { ...section, isExpanded: !section.isExpanded };
            }
            return section;
        }));
    };

    const handleNext = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].id);
        }
    };

    const handleBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].id);
        }
    };

    const handlePublish = async () => {
        setLoading(true);
        // TODO: Save to Supabase
        await new Promise((res) => setTimeout(res, 1500));
        router.push('/instructor/courses');
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        // TODO: Save draft to Supabase
        await new Promise((res) => setTimeout(res, 1000));
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/instructor/courses"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Create New Course</h1>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={handleSaveDraft}
                    disabled={loading}
                >
                    <Save className="w-4 h-4" />
                    Save Draft
                </button>
            </div>

            {/* Progress Steps */}
            <div className="glass-card p-4 mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === step.id
                                    ? 'bg-[var(--accent-500)]/20 text-[var(--accent-400)]'
                                    : index < currentStepIndex
                                        ? 'text-[var(--success-400)]'
                                        : 'text-[var(--text-tertiary)]'
                                    }`}
                                onClick={() => index <= currentStepIndex && setCurrentStep(step.id)}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === step.id
                                    ? 'bg-[var(--accent-500)]'
                                    : index < currentStepIndex
                                        ? 'bg-[var(--success-500)]'
                                        : 'bg-[var(--surface-glass)]'
                                    }`}>
                                    {index < currentStepIndex ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : (
                                        step.icon
                                    )}
                                </div>
                                <span className="hidden md:block font-medium">{step.label}</span>
                            </button>
                            {index < steps.length - 1 && (
                                <div className={`hidden md:block w-12 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-[var(--success-500)]' : 'bg-[var(--border-subtle)]'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="glass-card p-6">
                {/* Step 1: Basic Info */}
                {currentStep === 'basics' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Course Details</h2>
                            <p className="text-[var(--text-secondary)]">Provide the basic information about your course</p>
                        </div>

                        <div className="form-group">
                            <label className="input-label">Course Title *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., Complete Web Development Bootcamp"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Subtitle</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="A brief summary of your course"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Description *</label>
                            <textarea
                                className="input min-h-[120px]"
                                placeholder="Describe what students will learn in this course..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="form-group">
                                <label className="input-label">Category *</label>
                                <div className="relative">
                                    <select
                                        className="input appearance-none cursor-pointer"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Level *</label>
                                <div className="relative">
                                    <select
                                        className="input appearance-none cursor-pointer"
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                    >
                                        <option value="">Select level</option>
                                        {levels.map((lvl) => (
                                            <option key={lvl} value={lvl}>{lvl}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Language</label>
                                <div className="relative">
                                    <select
                                        className="input appearance-none cursor-pointer"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="input-label">Course Thumbnail</label>
                            <div className="border-2 border-dashed border-[var(--border-default)] rounded-xl p-8 text-center hover:border-[var(--primary-500)] transition-colors cursor-pointer">
                                <ImageIcon className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                                <p className="text-[var(--text-secondary)] mb-2">
                                    Drag and drop an image, or click to browse
                                </p>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    Recommended: 1280x720px, PNG or JPG
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Curriculum */}
                {currentStep === 'curriculum' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Course Curriculum</h2>
                            <p className="text-[var(--text-secondary)]">Build your course structure with sections and lessons</p>
                        </div>

                        <div className="space-y-4">
                            {sections.map((section, sectionIndex) => (
                                <div key={section.id} className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                                    {/* Section Header */}
                                    <div className="flex items-center gap-3 p-4 bg-[var(--surface-glass)]">
                                        <GripVertical className="w-4 h-4 text-[var(--text-tertiary)] cursor-grab" />
                                        <button onClick={() => toggleSection(section.id)}>
                                            {section.isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent border-none text-white font-medium focus:outline-none"
                                            value={section.title}
                                            onChange={(e) => {
                                                setSections(sections.map((s) =>
                                                    s.id === section.id ? { ...s, title: e.target.value } : s
                                                ));
                                            }}
                                            placeholder="Section title..."
                                        />
                                        <span className="text-xs text-[var(--text-tertiary)]">
                                            {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Lessons */}
                                    {section.isExpanded && (
                                        <div className="p-4 space-y-2 border-t border-[var(--border-subtle)]">
                                            {section.lessons.map((lesson) => (
                                                <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[var(--surface-glass)] rounded-lg">
                                                    <GripVertical className="w-4 h-4 text-[var(--text-tertiary)] cursor-grab" />
                                                    <select
                                                        className="w-24 px-2 py-1 bg-transparent border border-[var(--border-subtle)] rounded text-sm text-[var(--text-secondary)]"
                                                        value={lesson.type}
                                                        onChange={(e) => updateLesson(section.id, lesson.id, 'type', e.target.value)}
                                                    >
                                                        <option value="video">Video</option>
                                                        <option value="text">Text</option>
                                                        <option value="quiz">Quiz</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="flex-1 bg-transparent border-none text-white focus:outline-none"
                                                        placeholder="Lesson title..."
                                                        value={lesson.title}
                                                        onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                                                    />
                                                    <button
                                                        className="p-1 text-[var(--text-tertiary)] hover:text-[var(--error-400)] transition-colors"
                                                        onClick={() => removeLesson(section.id, lesson.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                className="btn btn-sm btn-ghost w-full justify-center"
                                                onClick={() => addLesson(section.id)}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Lesson
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-secondary w-full" onClick={addSection}>
                            <Plus className="w-4 h-4" />
                            Add Section
                        </button>
                    </div>
                )}

                {/* Step 3: Pricing */}
                {currentStep === 'pricing' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Pricing</h2>
                            <p className="text-[var(--text-secondary)]">Set the price for your course</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                className={`flex-1 p-4 rounded-xl border-2 transition-all ${!isFree
                                    ? 'border-[var(--accent-500)] bg-[var(--accent-500)]/10'
                                    : 'border-[var(--border-subtle)]'
                                    }`}
                                onClick={() => setIsFree(false)}
                            >
                                <DollarSign className={`w-8 h-8 mx-auto mb-2 ${!isFree ? 'text-[var(--accent-400)]' : 'text-[var(--text-tertiary)]'}`} />
                                <p className={`font-medium ${!isFree ? 'text-white' : 'text-[var(--text-secondary)]'}`}>Paid Course</p>
                            </button>
                            <button
                                className={`flex-1 p-4 rounded-xl border-2 transition-all ${isFree
                                    ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10'
                                    : 'border-[var(--border-subtle)]'
                                    }`}
                                onClick={() => setIsFree(true)}
                            >
                                <Globe className={`w-8 h-8 mx-auto mb-2 ${isFree ? 'text-[var(--primary-400)]' : 'text-[var(--text-tertiary)]'}`} />
                                <p className={`font-medium ${isFree ? 'text-white' : 'text-[var(--text-secondary)]'}`}>Free Course</p>
                            </button>
                        </div>

                        {!isFree && (
                            <div className="form-group">
                                <label className="input-label">Course Price (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                                    <input
                                        type="number"
                                        className="input pl-10"
                                        placeholder="99.99"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)] mt-2">
                                    You'll receive 70% of the course price (${price ? (parseFloat(price) * 0.7).toFixed(2) : '0.00'})
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Publish */}
                {currentStep === 'publish' && (
                    <div className="space-y-6 animate-fade-in text-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--success-500)]/20 flex items-center justify-center mx-auto">
                            <Check className="w-10 h-10 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Ready to Publish!</h2>
                            <p className="text-[var(--text-secondary)]">
                                Your course is ready. Review the details below and publish when ready.
                            </p>
                        </div>

                        <div className="glass-card p-4 text-left space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Title</span>
                                <span className="text-white font-medium">{title || 'Untitled Course'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Category</span>
                                <span className="text-white">{category || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Level</span>
                                <span className="text-white">{level || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Sections</span>
                                <span className="text-white">{sections.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Lessons</span>
                                <span className="text-white">{sections.reduce((acc, s) => acc + s.lessons.length, 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Price</span>
                                <span className="text-white font-medium">{isFree ? 'Free' : `$${price || '0'}`}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-subtle)]">
                    {currentStepIndex > 0 ? (
                        <button className="btn btn-secondary" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep === 'publish' ? (
                        <button
                            className="btn btn-accent btn-lg"
                            onClick={handlePublish}
                            disabled={loading}
                        >
                            {loading ? 'Publishing...' : 'Publish Course'}
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleNext}>
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
