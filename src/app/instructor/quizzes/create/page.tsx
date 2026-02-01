'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    ChevronDown,
    ChevronUp,
    Save,
    Eye,
    FileQuestion,
    Clock,
    Target,
    BookOpen,
    CheckCircle,
    Circle,
    HelpCircle,
    Type,
    ToggleLeft,
    AlignLeft,
    Settings,
    Sparkles
} from 'lucide-react';

interface Question {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    question: string;
    options: string[];
    correctAnswer: number | string;
    points: number;
    explanation?: string;
}

const courses = [
    { id: '1', title: 'Complete React Masterclass' },
    { id: '2', title: 'Node.js Backend Development' },
    { id: '3', title: 'JavaScript Essentials' },
    { id: '4', title: 'TypeScript Mastery' },
];

export default function CreateQuizPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [duration, setDuration] = useState(30);
    const [passingScore, setPassingScore] = useState(70);
    const [shuffleQuestions, setShuffleQuestions] = useState(true);
    const [showResults, setShowResults] = useState(true);
    const [allowRetakes, setAllowRetakes] = useState(true);
    const [maxAttempts, setMaxAttempts] = useState(3);

    // Questions State
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: '1',
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            points: 10,
        }
    ]);

    const [expandedQuestion, setExpandedQuestion] = useState<string | null>('1');

    const addQuestion = (type: Question['type']) => {
        const newId = (questions.length + 1).toString();
        const newQuestion: Question = {
            id: newId,
            type,
            question: '',
            options: type === 'multiple-choice' ? ['', '', '', ''] : type === 'true-false' ? ['True', 'False'] : [],
            correctAnswer: type === 'short-answer' ? '' : 0,
            points: 10,
        };
        setQuestions([...questions, newQuestion]);
        setExpandedQuestion(newId);
    };

    const removeQuestion = (id: string) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    };

    const updateOption = (questionId: string, optionIndex: number, value: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const addOption = (questionId: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.options.length < 6) {
                return { ...q, options: [...q.options, ''] };
            }
            return q;
        }));
    };

    const removeOption = (questionId: string, optionIndex: number) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.options.length > 2) {
                const newOptions = q.options.filter((_, i) => i !== optionIndex);
                const correctAnswer = typeof q.correctAnswer === 'number'
                    ? (q.correctAnswer >= optionIndex ? Math.max(0, q.correctAnswer - 1) : q.correctAnswer)
                    : q.correctAnswer;
                return { ...q, options: newOptions, correctAnswer };
            }
            return q;
        }));
    };

    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

    const handleSave = async (publish: boolean) => {
        setLoading(true);
        // TODO: Save to database
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/instructor/quizzes');
    };

    const getQuestionTypeIcon = (type: Question['type']) => {
        switch (type) {
            case 'multiple-choice': return <CheckCircle className="w-4 h-4" />;
            case 'true-false': return <ToggleLeft className="w-4 h-4" />;
            case 'short-answer': return <AlignLeft className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/instructor/quizzes"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Quizzes
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Create Quiz</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSave(false)}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        className="btn btn-accent"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Publish Quiz'}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileQuestion className="w-5 h-5 text-[var(--accent-400)]" />
                            Quiz Details
                        </h2>

                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="input-label">Quiz Title *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., React Fundamentals Assessment"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Description</label>
                                <textarea
                                    className="input min-h-[80px]"
                                    placeholder="Describe what this quiz covers..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Related Course</label>
                                <div className="relative">
                                    <select
                                        className="input appearance-none cursor-pointer"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        <option value="">No Course (Standalone)</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-[var(--accent-400)]" />
                                Questions ({questions.length})
                            </h2>
                            <span className="text-sm text-[var(--text-secondary)]">
                                Total: {totalPoints} points
                            </span>
                        </div>

                        <div className="space-y-4">
                            {questions.map((question, index) => (
                                <div key={question.id} className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                                    {/* Question Header */}
                                    <div
                                        className="flex items-center gap-3 p-4 bg-[var(--surface-glass)] cursor-pointer"
                                        onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                                    >
                                        <GripVertical className="w-4 h-4 text-[var(--text-tertiary)]" />
                                        <span className="w-8 h-8 rounded-full bg-[var(--primary-500)]/20 text-[var(--primary-400)] flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {question.question || 'New Question'}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                                                {getQuestionTypeIcon(question.type)}
                                                <span className="capitalize">{question.type.replace('-', ' ')}</span>
                                                <span>•</span>
                                                <span>{question.points} pts</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeQuestion(question.id);
                                            }}
                                            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--error-400)] rounded-lg hover:bg-[var(--surface-glass)]"
                                            disabled={questions.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {expandedQuestion === question.id ? (
                                            <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                                        )}
                                    </div>

                                    {/* Question Content */}
                                    {expandedQuestion === question.id && (
                                        <div className="p-4 space-y-4 border-t border-[var(--border-subtle)]">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="form-group">
                                                    <label className="input-label">Question Type</label>
                                                    <div className="relative">
                                                        <select
                                                            className="input appearance-none cursor-pointer"
                                                            value={question.type}
                                                            onChange={(e) => updateQuestion(question.id, {
                                                                type: e.target.value as Question['type'],
                                                                options: e.target.value === 'multiple-choice' ? ['', '', '', ''] :
                                                                    e.target.value === 'true-false' ? ['True', 'False'] : [],
                                                                correctAnswer: e.target.value === 'short-answer' ? '' : 0,
                                                            })}
                                                        >
                                                            <option value="multiple-choice">Multiple Choice</option>
                                                            <option value="true-false">True / False</option>
                                                            <option value="short-answer">Short Answer</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">Points</label>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        value={question.points}
                                                        onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 0 })}
                                                        min={1}
                                                        max={100}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="input-label">Question *</label>
                                                <textarea
                                                    className="input min-h-[80px]"
                                                    placeholder="Enter your question..."
                                                    value={question.question}
                                                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                                />
                                            </div>

                                            {/* Multiple Choice Options */}
                                            {question.type === 'multiple-choice' && (
                                                <div className="form-group">
                                                    <label className="input-label">Options (Click circle to mark correct answer)</label>
                                                    <div className="space-y-2">
                                                        {question.options.map((option, optIndex) => (
                                                            <div key={optIndex} className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuestion(question.id, { correctAnswer: optIndex })}
                                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${question.correctAnswer === optIndex
                                                                        ? 'border-[var(--success-500)] bg-[var(--success-500)]'
                                                                        : 'border-[var(--border-default)]'
                                                                        }`}
                                                                >
                                                                    {question.correctAnswer === optIndex && (
                                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                                    )}
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    className="input flex-1"
                                                                    placeholder={`Option ${optIndex + 1}`}
                                                                    value={option}
                                                                    onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                                                />
                                                                {question.options.length > 2 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeOption(question.id, optIndex)}
                                                                        className="p-2 text-[var(--text-tertiary)] hover:text-[var(--error-400)]"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {question.options.length < 6 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => addOption(question.id)}
                                                                className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)] flex items-center gap-1"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add Option
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* True/False */}
                                            {question.type === 'true-false' && (
                                                <div className="form-group">
                                                    <label className="input-label">Correct Answer</label>
                                                    <div className="flex gap-4">
                                                        {['True', 'False'].map((option, index) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() => updateQuestion(question.id, { correctAnswer: index })}
                                                                className={`flex-1 p-4 rounded-xl border-2 transition-all ${question.correctAnswer === index
                                                                    ? 'border-[var(--success-500)] bg-[var(--success-500)]/10'
                                                                    : 'border-[var(--border-subtle)]'
                                                                    }`}
                                                            >
                                                                <span className={`font-medium ${question.correctAnswer === index ? 'text-[var(--success-400)]' : 'text-[var(--text-secondary)]'}`}>
                                                                    {option}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Short Answer */}
                                            {question.type === 'short-answer' && (
                                                <div className="form-group">
                                                    <label className="input-label">Correct Answer</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        placeholder="Enter the correct answer..."
                                                        value={question.correctAnswer as string}
                                                        onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                                                    />
                                                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                                        Student answers will be compared case-insensitively
                                                    </p>
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label className="input-label">Explanation (Optional)</label>
                                                <textarea
                                                    className="input min-h-[60px]"
                                                    placeholder="Explain the correct answer..."
                                                    value={question.explanation || ''}
                                                    onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Question Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => addQuestion('multiple-choice')}
                                className="btn btn-secondary btn-sm"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Multiple Choice
                            </button>
                            <button
                                type="button"
                                onClick={() => addQuestion('true-false')}
                                className="btn btn-secondary btn-sm"
                            >
                                <ToggleLeft className="w-4 h-4" />
                                True / False
                            </button>
                            <button
                                type="button"
                                onClick={() => addQuestion('short-answer')}
                                className="btn btn-secondary btn-sm"
                            >
                                <AlignLeft className="w-4 h-4" />
                                Short Answer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[var(--accent-400)]" />
                            Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="input-label flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Time Limit (minutes)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                    min={1}
                                    max={180}
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Passing Score (%)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={passingScore}
                                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                                    min={1}
                                    max={100}
                                />
                            </div>

                            <label className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg cursor-pointer">
                                <span className="text-sm text-[var(--text-secondary)]">Shuffle Questions</span>
                                <input
                                    type="checkbox"
                                    checked={shuffleQuestions}
                                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--border-default)]"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg cursor-pointer">
                                <span className="text-sm text-[var(--text-secondary)]">Show Results After</span>
                                <input
                                    type="checkbox"
                                    checked={showResults}
                                    onChange={(e) => setShowResults(e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--border-default)]"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg cursor-pointer">
                                <span className="text-sm text-[var(--text-secondary)]">Allow Retakes</span>
                                <input
                                    type="checkbox"
                                    checked={allowRetakes}
                                    onChange={(e) => setAllowRetakes(e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--border-default)]"
                                />
                            </label>

                            {allowRetakes && (
                                <div className="form-group">
                                    <label className="input-label">Max Attempts</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={maxAttempts}
                                        onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)}
                                        min={1}
                                        max={10}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white mb-4">Quiz Summary</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Questions</span>
                                <span className="text-white font-medium">{questions.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Total Points</span>
                                <span className="text-white font-medium">{totalPoints}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Time Limit</span>
                                <span className="text-white font-medium">{duration} min</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Passing Score</span>
                                <span className="text-white font-medium">{passingScore}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
