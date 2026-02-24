'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Video,
    VideoOff,
    Mic,
    MicOff,
    MonitorUp,
    MonitorOff,
    MessageSquare,
    Users,
    Hand,
    Settings,
    MoreVertical,
    Send,
    ThumbsUp,
    AlertCircle,
    X,
    Maximize2,
    Minimize2,
    PhoneOff,
    Pause,
    Play,
    Volume2,
    VolumeX,
    BarChart3,
    Clock,
    Zap,
    Gift,
    Star,
    CheckCircle,
    Circle
} from 'lucide-react';

interface ChatMessage {
    id: string;
    user: string;
    avatar: string;
    message: string;
    timestamp: string;
    isInstructor?: boolean;
}

interface Participant {
    id: string;
    name: string;
    avatar: string;
    handRaised: boolean;
    isMuted: boolean;
    joinedAt: string;
}

interface Question {
    id: string;
    user: string;
    question: string;
    votes: number;
    answered: boolean;
}

const mockMessages: ChatMessage[] = [
    { id: '1', user: 'John Doe', avatar: 'JD', message: 'Hello everyone! Excited for this session!', timestamp: '2 min ago' },
    { id: '2', user: 'Jane Smith', avatar: 'JS', message: 'Can you explain compound components again?', timestamp: '1 min ago' },
    { id: '3', user: 'You', avatar: 'SJ', message: 'Sure! Let me show you an example.', timestamp: 'Just now', isInstructor: true },
];

const mockParticipants: Participant[] = [
    { id: '1', name: 'John Doe', avatar: 'JD', handRaised: false, isMuted: true, joinedAt: '15 min ago' },
    { id: '2', name: 'Jane Smith', avatar: 'JS', handRaised: true, isMuted: false, joinedAt: '12 min ago' },
    { id: '3', name: 'Mike Johnson', avatar: 'MJ', handRaised: false, isMuted: true, joinedAt: '10 min ago' },
    { id: '4', name: 'Sarah Williams', avatar: 'SW', handRaised: true, isMuted: false, joinedAt: '8 min ago' },
    { id: '5', name: 'Alex Brown', avatar: 'AB', handRaised: false, isMuted: true, joinedAt: '5 min ago' },
];

const mockQuestions: Question[] = [
    { id: '1', user: 'Jane Smith', question: 'How do compound components differ from render props?', votes: 12, answered: false },
    { id: '2', user: 'Mike Johnson', question: 'Can you show a real-world example of this pattern?', votes: 8, answered: false },
    { id: '3', user: 'Alex Brown', question: 'Is this compatible with TypeScript?', votes: 5, answered: true },
];

export default function LiveStudioPage() {
    const params = useParams();
    const router = useRouter();
    const [isLive, setIsLive] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'qa'>('chat');

    // Controls state
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [participants] = useState<Participant[]>(mockParticipants);
    const [questions, setQuestions] = useState<Question[]>(mockQuestions);

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLive) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLive]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            user: 'You',
            avatar: 'SJ',
            message: newMessage,
            timestamp: 'Just now',
            isInstructor: true,
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };

    const handleAnswerQuestion = (questionId: string) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? { ...q, answered: true } : q
        ));
    };

    const startClass = () => {
        setIsLive(true);
        setIsRecording(true);
    };

    const endClass = () => {
        setIsLive(false);
        setIsRecording(false);
        // Redirect to analytics or summary
    };

    const raisedHands = participants.filter(p => p.handRaised).length;

    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] z-50">
            {/* Top Bar */}
            <div className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href={`/instructor/live/${params.id}`} className="text-[var(--text-secondary)] hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-semibold text-sm">Advanced React Patterns & Best Practices</h1>
                        <div className="flex items-center gap-2 text-xs">
                            {isLive ? (
                                <>
                                    <span className="flex items-center gap-1 text-[var(--error-400)]">
                                        <span className="w-2 h-2 rounded-full bg-[var(--error-500)] animate-pulse" />
                                        LIVE
                                    </span>
                                    <span className="text-[var(--text-tertiary)]">•</span>
                                    <span className="text-[var(--text-secondary)]">{formatTime(elapsedTime)}</span>
                                </>
                            ) : (
                                <span className="text-[var(--warning-400)]">Not Started</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-glass)] rounded-lg">
                        <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
                        <span className="text-sm text-white">{participants.length}</span>
                    </div>

                    {isRecording && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--error-500)]/20 rounded-lg">
                            <Circle className="w-4 h-4 text-[var(--error-400)]" />
                            <span className="text-sm text-[var(--error-400)]">Recording</span>
                        </div>
                    )}

                    {!isLive ? (
                        <button onClick={startClass} className="btn btn-accent btn-sm">
                            <Play className="w-4 h-4" />
                            Go Live
                        </button>
                    ) : (
                        <button onClick={endClass} className="btn bg-[var(--error-500)] hover:bg-[var(--error-600)] text-white btn-sm">
                            <PhoneOff className="w-4 h-4" />
                            End Class
                        </button>
                    )}
                </div>
            </div>

            <div className="flex h-[calc(100vh-3.5rem)]">
                {/* Main Video Area */}
                <div className="flex-1 flex flex-col">
                    {/* Video Preview */}
                    <div className="flex-1 relative bg-[var(--bg-tertiary)] m-4 rounded-2xl overflow-hidden">
                        {/* Main video placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {videoEnabled ? (
                                <div className="text-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)] flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl font-bold text-white">SJ</span>
                                    </div>
                                    <p className="text-white font-medium">Your camera preview</p>
                                    <p className="text-sm text-[var(--text-tertiary)]">Students will see your video here</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <VideoOff className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                                    <p className="text-[var(--text-secondary)]">Camera is off</p>
                                </div>
                            )}
                        </div>

                        {/* Screen share indicator */}
                        {screenSharing && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--success-500)]/20 rounded-lg flex items-center gap-2">
                                <MonitorUp className="w-4 h-4 text-[var(--success-400)]" />
                                <span className="text-sm text-[var(--success-400)]">Screen Sharing</span>
                            </div>
                        )}

                        {/* Raised hands notification */}
                        {raisedHands > 0 && (
                            <div className="absolute top-4 right-4 px-3 py-1.5 bg-[var(--warning-500)]/20 rounded-lg flex items-center gap-2">
                                <Hand className="w-4 h-4 text-[var(--warning-400)]" />
                                <span className="text-sm text-[var(--warning-400)]">{raisedHands} raised</span>
                            </div>
                        )}

                        {/* Fullscreen toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70"
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Controls Bar */}
                    <div className="h-20 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex items-center justify-center gap-3 px-4">
                        <button
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${audioEnabled
                                ? 'bg-[var(--surface-glass)] text-white hover:bg-[var(--surface-glass-hover)]'
                                : 'bg-[var(--error-500)] text-white'
                                }`}
                        >
                            {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setVideoEnabled(!videoEnabled)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${videoEnabled
                                ? 'bg-[var(--surface-glass)] text-white hover:bg-[var(--surface-glass-hover)]'
                                : 'bg-[var(--error-500)] text-white'
                                }`}
                        >
                            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setScreenSharing(!screenSharing)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${screenSharing
                                ? 'bg-[var(--success-500)] text-white'
                                : 'bg-[var(--surface-glass)] text-white hover:bg-[var(--surface-glass-hover)]'
                                }`}
                        >
                            {screenSharing ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
                        </button>

                        <div className="w-px h-8 bg-[var(--border-subtle)]" />

                        <button
                            onClick={() => setIsRecording(!isRecording)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isRecording
                                ? 'bg-[var(--error-500)] text-white'
                                : 'bg-[var(--surface-glass)] text-white hover:bg-[var(--surface-glass-hover)]'
                                }`}
                        >
                            <Circle className="w-5 h-5" />
                        </button>

                        <button className="w-12 h-12 rounded-full bg-[var(--surface-glass)] text-white hover:bg-[var(--surface-glass-hover)] flex items-center justify-center">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="w-80 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-[var(--border-subtle)]">
                        {([
                            { id: 'chat', label: 'Chat', icon: MessageSquare },
                            { id: 'participants', label: 'People', icon: Users },
                            { id: 'qa', label: 'Q&A', icon: Hand },
                        ] as const).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                                    ? 'text-[var(--accent-400)] border-b-2 border-[var(--accent-500)]'
                                    : 'text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {tab.id === 'qa' && questions.filter(q => !q.answered).length > 0 && (
                                    <span className="px-1.5 py-0.5 text-xs bg-[var(--accent-500)] text-white rounded-full">
                                        {questions.filter(q => !q.answered).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {/* Chat Tab */}
                        {activeTab === 'chat' && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex gap-3 ${msg.isInstructor ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${msg.isInstructor
                                                ? 'bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)]'
                                                : 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)]'
                                                }`}>
                                                {msg.avatar}
                                            </div>
                                            <div className={`flex-1 ${msg.isInstructor ? 'text-right' : ''}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-sm font-medium ${msg.isInstructor ? 'text-[var(--accent-400)]' : 'text-white'}`}>
                                                        {msg.user}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-tertiary)]">{msg.timestamp}</span>
                                                </div>
                                                <p className={`text-sm text-[var(--text-secondary)] ${msg.isInstructor
                                                    ? 'bg-[var(--accent-500)]/20 inline-block px-3 py-2 rounded-xl rounded-tr-none'
                                                    : 'bg-[var(--surface-glass)] inline-block px-3 py-2 rounded-xl rounded-tl-none'
                                                    }`}>
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-subtle)]">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input text-sm py-2"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-accent btn-sm">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Participants Tab */}
                        {activeTab === 'participants' && (
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {participants.map((participant) => (
                                    <div key={participant.id} className="flex items-center justify-between p-3 bg-[var(--surface-glass)] rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-xs font-semibold text-white">
                                                    {participant.avatar}
                                                </div>
                                                {participant.handRaised && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--warning-500)] rounded-full flex items-center justify-center">
                                                        <Hand className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">{participant.name}</p>
                                                <p className="text-xs text-[var(--text-tertiary)]">Joined {participant.joinedAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {participant.isMuted ? (
                                                <MicOff className="w-4 h-4 text-[var(--text-tertiary)]" />
                                            ) : (
                                                <Mic className="w-4 h-4 text-[var(--success-400)]" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Q&A Tab */}
                        {activeTab === 'qa' && (
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {questions.sort((a, b) => b.votes - a.votes).map((question) => (
                                    <div key={question.id} className={`p-3 rounded-lg border ${question.answered
                                        ? 'bg-[var(--success-500)]/10 border-[var(--success-500)]/30'
                                        : 'bg-[var(--surface-glass)] border-[var(--border-subtle)]'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <button className="p-1 text-[var(--text-tertiary)] hover:text-[var(--primary-400)]">
                                                    <ThumbsUp className="w-4 h-4" />
                                                </button>
                                                <span className="text-sm font-medium text-[var(--primary-400)]">{question.votes}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-white mb-1">{question.question}</p>
                                                <p className="text-xs text-[var(--text-tertiary)]">by {question.user}</p>
                                            </div>
                                            {!question.answered && (
                                                <button
                                                    onClick={() => handleAnswerQuestion(question.id)}
                                                    className="btn btn-sm btn-ghost"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {question.answered && (
                                                <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
